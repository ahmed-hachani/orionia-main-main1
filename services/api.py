from fastapi import FastAPI, Request, Form, Cookie, HTTPException, Depends, File, Form, UploadFile,Response
from fastapi.responses import HTMLResponse, RedirectResponse,FileResponse,JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import Body

from services.auth.auth_bearer import JWTBearer
from services.auth.auth_handler import signJWT,decodeJWT

from db.db_connection import DB_USERS
from db.aws_transfer  import AWS_TRANSFER
from modules.models   import controlNet
from modules.services import SupportMail

from db.model_data import  UserSchema, UserLoginSchema,ForgotPasswordRequest
import datetime

import secrets
import string
import hashlib
import uvicorn
import jwt

app    = FastAPI()
aws    = AWS_TRANSFER()
model  = controlNet()
db     = DB_USERS()
mailto = SupportMail()

# Pour servir les fichiers statiques, par exemple les images.
app.mount("/assets", StaticFiles(directory="templates/assets"), name="assets")

# Configuration de Jinja2 pour les templates
templates = Jinja2Templates(directory="templates")

# Clé secrète pour les tokens JWT
SECRET_KEY = "sferfrfazdbdezjhdbezjhbchejbchrecrbjcec"


#LOGIN

@app.get("/", response_class=HTMLResponse, tags=["user"])
async def login_root(request: Request, token: str = Cookie(None)):
    return templates.TemplateResponse("login.html", {"request": request})


@app.get("/login", response_class=HTMLResponse, tags=["user"])
async def login_get(request: Request, token: str = Cookie(None)):
    return templates.TemplateResponse("login.html", {"request": request})


@app.post("/login", response_class=HTMLResponse)
async def login(request: Request, email: str = Form(...), password: str = Form(...)):
    #on recupuere le token si le user existe dans la base
    result =db.check_user(email,hashlib.sha512(password.encode()).hexdigest())
    if result:
            response = templates.TemplateResponse("dashboard.html", {"request": request})
            # Ajouter le token JWT dans un cookie sécurisé
            token=signJWT(email)
            response.set_cookie(key="access_token", value=token['access_token'], httponly=False, secure=False)
            return response
    error = "Email ou mot de passe incorrect"
    return templates.TemplateResponse("login.html", {"request": request, "error": error})


#UPLOAD
@app.post("/upload/")
async def create_upload_file(request:Request,photo_file: UploadFile = File(...),room_type : str = Form(...),room_style: str= Form(...),room_color: str = Form(...)):

    mail=decodeJWT(request.cookies['access_token'])['user_id']
    if mail:
        aws.send_picture_to_s3(photo_file.file.read(), mail+'_db/demand', photo_file.filename)
        img=aws.read_binary_image_s3(mail+'_db/demand/'+photo_file.filename)
        response=model.send_picture_to_replicate(img,room_type,room_style,room_color)
        aws.send_picture_to_s3(response, mail+'_db/response', photo_file.filename)

        return {"filename": photo_file.filename}

    #todo handle error
    print("Error !")


#DELIVERY IMG AND EVALUATE

@app.get("/showimage")
async def read_image(request:Request):

    mail=decodeJWT(request.cookies['access_token'])['user_id']

    file_name=aws.get_latest_file_s3(mail+'_db/response/')
    file_content=aws.obtenir_url_image_s3(file_name)

    return Response(content=file_content, media_type="image/jpg")


@app.post("/picture-evalutation")
async def process_image_data(request:Request,isLiked: bool = Form(...)):

    mail=decodeJWT(request.cookies['access_token'])['user_id']

    file_name=aws.get_latest_file_s3(mail+'_db/response/')
    db.evalute_picture(file_name,mail,isLiked)


#DASHBOARD
@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request, token: str = Cookie(None)):
    try:
        mail=decodeJWT(request.cookies['access_token'])['user_id']
    except:
        return templates.TemplateResponse("login.html", {"request": request})

    return templates.TemplateResponse("dashboard.html", {"request": request})


#PROFIL USER
@app.get("/monprofil", response_class=HTMLResponse)
async def dashboard(request: Request, token: str = Cookie(None)):
    try:
        mail=decodeJWT(request.cookies['access_token'])['user_id']
    except:
        return templates.TemplateResponse("login.html", {"request": request})

    return templates.TemplateResponse("profile.html", {"request": request})



#SUPPORT AND TERM
@app.get("/support", response_class=HTMLResponse)
async def dashboard(request: Request, token: str = Cookie(None)):
    try:
        mail=decodeJWT(request.cookies['access_token'])['user_id']
    except:
        return templates.TemplateResponse("login.html", {"request": request})

    return templates.TemplateResponse("support.html", {"request": request})


@app.get("/pricing", response_class=HTMLResponse)
async def dashboard(request: Request, token: str = Cookie(None)):
    return templates.TemplateResponse("pricing.html", {"request": request})


@app.post("/report-problem")
async def get_problem_reported(request: Request,text: str = Form(...), files: UploadFile = File(...)):

    try:
        mail=decodeJWT(request.cookies['access_token'])['user_id']
    except:
        return templates.TemplateResponse("login.html", {"request": request})


    aws.send_picture_to_s3(files.file.read(), mail+'_db/bug', files.filename)
    img=aws.obtenir_url_image_s3(mail+'_db/bug/'+files.filename)
    mailto.send_mail_bug(text,img)


    return {"message": "E-mail envoyé avec succès !"}



#FORGOT PASSWORD
def generate_reset_link(email: str):
    # Générer un jeton aléatoire sécurisé pour le lien
    alphabet = string.ascii_letters + string.digits
    reset_link_token = ''.join(secrets.choice(alphabet) for _ in range(16))
    
    # Construire le lien de réinitialisation avec le jeton unique
    reset_link = f"/reset-password/{reset_link_token}"

    return reset_link


@app.post("/forgot-password")
async def forgot_password(request: Request, email: str = Form(...)):
    # Vérification de l'adresse e-mail dans la base de données (simulation ici)
    # Remplacez cette étape par votre propre logique de vérification d'e-mail
    # et génération d'un jeton de réinitialisation de mot de passe
    print(request.cookies)
    print(email)

    # Génération d'un jeton de réinitialisation de mot de passe sécurisé
    reset_link = generate_reset_link(email)
    print(reset_link)
    db.add_reset_password_link(reset_link,email,datetime.datetime.now())
    
    mailto.send_mail_reset_password(email,reset_link)
    # Enregistrement du jeton de réinitialisation dans la base de données (simulation ici)
    # Remplacez cette étape par votre propre logique de stockage du jeton
    #save_reset_token(data.email, reset_token) 
    return templates.TemplateResponse("login.html", {"request": request, "message": "Un lien de réinitialisation de mot de passe a été envoyé sur votre adresse e-mail."})


@app.get("/reset-password/{reset_link}")
async def reset_password(request: Request,reset_link: str):
    print("lien valide !!!")

    # Afficher une page pour le changement de mot de passe
    return templates.TemplateResponse("forgot-password.html")



#TEST
@app.get("/testClefJWT", response_class=JSONResponse,  dependencies=[Depends(JWTBearer())])
async def get_user_information(request: Request, token: str = Cookie(None)):
    dictOutput = {}
    dictOutput['r'] = 'rr'
    return JSONResponse(content=dictOutput)


@app.get("/user-informations", response_class=JSONResponse)
async def get_user_information(request: Request, token: str = Cookie(None)):
    try:
        mail=decodeJWT(request.cookies['access_token'])['user_id']
    except:
        return templates.TemplateResponse("login.html", {"request": request})
        
    result=db.get_user_information(mail)

    return JSONResponse(content=result)

