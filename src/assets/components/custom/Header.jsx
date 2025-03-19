import React from "react";

function Header(){
    return(
        <div className='p-3 shadow-sm flex justify-between item-centre px-5'>
            <img src='/logo.svg'/>
            <div>
                <button className="text-orange-500">Sign In</button>
            </div>
        </div>
    )
}

export default Header