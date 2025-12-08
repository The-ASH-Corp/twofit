import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { blogsdata } from '../../utils/constants'
import BlogDetails from '../../pages/BlogDetails'
import fb from "../../assets/Icons/facebookicon.svg"
import Insta from "../../assets/Icons/instagramicon.svg"
import X from "../../assets/Icons/xicon.svg"
import linkedin from "../../assets/Icons/linkedinicon.svg"
import group from "../../assets/Icons/groupicon.svg"
import share from "../../assets/Icons/shareIcon.svg"
import moment from 'moment'
import axios from 'axios'


function Details() {
    const { blogId } = useParams()
    const [blogsData, setBlogsData] = useState([])

    useEffect(() => {
        axios
            .get(`https://outstanding-stillness-production.up.railway.app/api/v1/blog/get/${blogId}`)
            .then((res) => {
                console.log("BLOG DATA:", res.data.data); 
                setBlogsData(res.data.data)
                 
            })
            .catch((Error) => {
                console.log(Error);
            })
    }, [blogId]);

    if (!blogsData) {
        return <p className="text-center mt-20">Loading blog details...</p>;
    }

    return (
        <div className='my-40 mx-4 md:mx-20 lg:mx-38'>
            <div className='flex flex-col gap-10'>
                <div>
                    <p className='text-5xl font-bold'>{blogsData.heading}</p>
                </div>
                <div className='w-full flex flex-col gap-10'>
                    <div className='flex flex-col gap-5'>
                        <div className='flex flex-row justify-between'>
                            <p className='text-[#1E1E1E]'>Published on {moment(blogsData.createdAt).format("DD MMMM YYYY")}</p>
                            <div className='items-center'>
                                <div className='cursor-pointer border border-gray-500 rounded-full'>
                                    <img className='block md:hidden mx-2 h-5 w-5 my-2' src={share} alt="" />
                                </div>
                            </div>
                            <div className=' flex-row items-center gap-4 hidden md:flex'>
                                <p className='text-[#000000B2]'>Share</p>
                                <div className='flex flex-row gap-3 '>
                                    <div className='cursor-pointer border border-gray-500 rounded-full '>
                                        <img className='mx-2 h-3 w-3 my-2' src={fb} alt="" />
                                    </div>
                                    <div className='cursor-pointer border border-gray-500 rounded-full '>
                                        <img className='mx-2 h-3 w-3 my-2' src={X} alt="" />
                                    </div>
                                    <div className='cursor-pointer border border-gray-500 rounded-full '>
                                        <img className='mx-2 h-3 w-3 my-2' src={Insta} alt="" />
                                    </div>
                                    <div className='cursor-pointer border border-gray-500 rounded-full '>
                                        <img className='mx-2 h-3 w-3 my-2' src={linkedin} alt="" />
                                    </div>
                                    <div className='cursor-pointer border border-gray-500 rounded-full '>
                                        <img className='mx-2 h-3 w-3 my-2' src={group} alt="" />

                                    </div>
                                </div>
                            </div>
                        </div>
                        <img className='w-full rounded-xl' src={`${import.meta.env.VITE_API_URL}${blogsData.image}`} alt="" />
                    </div>
                    <div className='flex flex-col gap-10'>
                        <p className='text-sm'>{blogsData.description}</p>
                        <div className='flex flex-col gap-10'>
                            {blogsData.points?.map((point, index) => (
                                <div className=' flex flex-col ' key={index}>
                                    <div className=' flex flex-col gap-3'>
                                        <p className='font-bold text-xl'>{index + 1}.{point.subHeading}</p>
                                        <p className='text-sm'>{point.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    )
}

export default Details
