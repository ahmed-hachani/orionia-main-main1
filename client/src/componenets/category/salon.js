import React, {useState} from 'react';
import Choose from './Choose';
import Navbar from '../Navbar/Navbar';
 import sl from '../img/sl.webp';
import UnderDashboard from '../dashboard/UnderDashboard';
import Footer1 from '../decoration/Footer1';
function Salon() {

    return (
   <div>
    <Navbar/>           

         <div className=''>
    <h1 className="displayyy-4 fw-bolder" > </h1>
    </div>       
     <header className=" py-5">
    <div className="container px-4 px-lg-5 my-5">
      <div className="text-center ">
        <h1 className="display-4 fw-bolder" ></h1>
        <p className="lead fw-normal text-white-50 mb-0"></p>
      </div>
    </div>
  </header>
<Choose/>
<UnderDashboard/>
<Footer1/>
   </div>
    );
}

export default Salon;