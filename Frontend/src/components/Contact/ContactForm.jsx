import React, { useState } from 'react'
import Heading from '../shared/Heading'
import imag from "../../assets/images/Rectangle2.svg"
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";



export default function ContactForm() {
    const [ConatctData, setContactData] = useState({
        fname: '',
        lname: '',
        email: '',
        phone: '',
        gender: "",
        city: "",
        address: "",
        message: "",
        code: ''
    })
    const handleChange = (e) => {
        setContactData((prev) => ({
            ...prev, [e.target.name]: e.target.value
        }))
    }
    return (
        <div className='my-8'>
            <div>
                <div>
                    <Heading heading={"Get in Touch"} description={"We’d love to hear from you."} />
                </div>
                <form action="" className='bg-green900 mx-2 sm:mx-10 md:mx-20'>
                    <div className='bg-amber900 flex flex-col gap-5 md:gap-5 p-10 '>
                        <div className='flex gap-5 md:gap-10 flex-col md:flex-row'>
                            <div className='flex flex-col w-full md:w-1/2'>
                                <label htmlFor="">First name*</label>
                                <input className='w-full rounded-xl p-2 border border-black/20' type="text" placeholder='Enter your First name' value={ConatctData.fname} onChange={handleChange} name='fname' />
                            </div>
                            <div className='flex flex-col w-full md:w-1/2'>
                                <label htmlFor="">Last Name</label>
                                <input className='w-full rounded-xl p-2 border border-black/20' type="text" placeholder='Enter your Last name' value={ConatctData.lname} onChange={handleChange} name='lname' />
                            </div>

                        </div>
                        <div className='flex gap-5 md:gap-10 flex-col md:flex-row '>
                            <div className='flex flex-col w-full md:w-1/2'>
                                <label htmlFor="">Email</label>
                                <input className='w-full rounded-xl p-2 border border-black/20' type="text" placeholder='Enetr your email ID' value={ConatctData.email} onChange={handleChange} name='email' />
                            </div>
                            <div className='flex flex-col w-full md:w-1/2'>
                                <label htmlFor="">Phone Numner</label>
                                {/* <input className='w-full rounded-xl p-2 border border-black/20' type="number" placeholder='Enter your phone number' value={ConatctData.phone} onChange={handleChange} name='phone' /> */}
                                <PhoneInput
                                    country={"in"}
                                    value={ConatctData.phone}
                                    onChange={(phone, countryData) =>
                                        setContactData((prev) => ({
                                            ...prev,
                                            phone: phone,
                                            code: countryData.dialCode
                                        }))
                                    }
                                    containerClass="w-full border py-[3px]  border-black/20 rounded-xl flex "
                                    inputClass="flex-1 w-full"
                                    buttonClass='phone-flag-btn hover:bg-red-800'
                                    inputStyle={{ borderRadius: 20 ,  border:'none',}}
                                    // containerStyle={{}}
                                    buttonStyle={{border:'none',borderTopLeftRadius:12 ,borderBottomLeftRadius:12}}
                                />


                            </div>

                        </div>

                        <div className='flex gap-5 md:gap-10 flex-col md:flex-row '>
                            <div className='flex flex-col w-full md:w-1/2'>

                                <label htmlFor="">Gender</label>
                                <select className='w-full border border-black/20 p-2 rounded-xl' name="gender" id="" onChange={handleChange}>
                                    <option value="none">Select your gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className='flex flex-col w-full md:w-1/2'>
                                <label htmlFor="">City</label>
                                <select className='w-full border border-black/20 p-2 rounded-xl ' name="city" id="" value={ConatctData.city} onChange={handleChange}>
                                    <option value="none">Select City</option>
                                    <option value="c1">city 2</option>
                                    <option value="c2">city 3</option>
                                    <option value="c3">city 5</option>
                                    <option value="c4">city 6</option>
                                </select>
                            </div>
                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor="">Address</label>
                            <input className='w-full rounded-xl p-2 border border-black/20' type="text" placeholder='Enter your address' value={ConatctData.address} onChange={handleChange} name='address' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor="">Message</label>
                            <textarea className='w-full rounded-xl p-2 border border-black/20' rows={8} type="text" placeholder='Enter your message' value={ConatctData.message} onChange={handleChange} name='message' />

                        </div>
                        <div className='w-full'>
                            <button className='bg-[#0A4F48] text-white text-sm cursor-pointer rounded-full px-10 py-3' type='submit'>Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}






