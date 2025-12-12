import React from 'react'
import Heading from '../shared/Heading'
import image from '../../assets/images/ourstory_main.svg'


export default function WhereOurJourneyBegan() {
    return (
        <div className='my-30 mx-4 md:mx-20 lg:mx-38 justify-center'>
            <div className='flex flex-col gap-1 md:gap-18 mb-30 justify-center content-center'>
                <div>
                    <Heading heading={
                        <>
                            Where Our <br /> Journey Began
                        </>
                    } />
                </div>
                <div>
                    <img className='rounded-2xl' src={image} alt="" />
                </div>
                <div className='flex flex-col md:flex-row md:gap-27 gap-4 w-full'>
                    <div className='w-full md:w-1/2'>
                        <div className='flex flex-col md:w-auto gap-4'>
                            <p className='text-[#0A4F48] font-semibold'>Our Story</p>
                            <p className='w-full text-2xl md:text-5xl font-bold'>The Birth Of Twofit</p>
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-8 mt-0 md:mt-10'>
                        <p className='text-sm leading-[150%]'>In 2020, Coach Afi started as an online coach helping people transform their lives with simple, real, and truly personalized guidance. Her approach real food, real care, real results quickly earned trust.<br/>Over the next five years, her proven system of fitness, nutrition, and mindset coaching changed countless lives. In 2025, that vision evolved into Twofit.</p>
                        <div className='flex flex-col gap-5'>
                            <p className='text-sm '>Today, Twofit is a fully customized coaching platform powered by:</p>
                            <div>
                                <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                    <li><span className='bg-black rounded-full inline-block h-2.5 w-2.5 mr-3'></span><span className='font-bold'>Doctors</span> for medical insights</li>
                                    <li><span className='bg-black rounded-full inline-block h-2.5 w-2.5 mr-3'></span><span className='font-bold'>Trainers</span> for fitness goals</li>
                                    <li><span className='bg-black rounded-full inline-block h-2.5 w-2.5 mr-3'></span><span className='font-bold'>Dietitians</span> for personalized nutrition</li>
                                    <li><span className='bg-black rounded-full inline-block h-2.5 w-2.5 mr-3'></span><span className='font-bold'>Therapists</span> for mental wellness</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
