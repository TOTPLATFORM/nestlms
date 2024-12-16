import { Injectable } from "@nestjs/common";
import { User } from "../users/entities/user.entity";
import { AddToWishListDto } from "./user/add-to-wishlist.dto";
import { PrismaClient, addPhotoPrefix, errorResponse, paginatioOptions, paginationMetaData, processException, successResponse } from "src/shared/helpers/functions";
import { coreConstant } from "src/shared/helpers/coreConstant";

@Injectable()
export class WishListService {
    async addToWishList(user:User, payload:AddToWishListDto){
        try{
            const courseDetails = await PrismaClient.course.findFirst({
                where:{
                    id:payload.course_id
                }
            });

            if(!courseDetails)
            {
                return errorResponse('Invalid Course!');
            }

            const checkAlreadyExist = await PrismaClient.wishList.findFirst({
                where:{
                    courseId:courseDetails.id,
                    studentId:user.id
                }
            })
            if(checkAlreadyExist)
            {
                const updatedWishlist = await PrismaClient.wishList.update({
                    where:{
                        id:checkAlreadyExist.id
                    }, 
                    data:{
                        status:checkAlreadyExist.status === coreConstant.STATUS_ACTIVE?coreConstant.STATUS_INACTIVE:coreConstant.STATUS_ACTIVE
                    }
                })

                if(updatedWishlist.status)
                {
                    return successResponse('Course is add to wishlist successfully!',updatedWishlist);
                }else{
                    return errorResponse('Course is removed from wishlist!',updatedWishlist);
                }
                
            }else{
                const wishListDetails = await PrismaClient.wishList.create({
                    data:{
                        studentId:user.id,
                        courseId:payload.course_id,
                        status:coreConstant.STATUS_ACTIVE
                    }
                })

                return successResponse('Course is add to wishlist successfully!',wishListDetails);
            }
            

            
        }catch(error){
            processException(error);
        }
    }

    async getMyWishListByPaginate(user:User, payload:any)
    {
        try{
            const paginate = await paginatioOptions(payload);
            const wishList = await PrismaClient.wishList.findMany({
                where:{
                    studentId:user.id
                },
                include:{
                    Course:{
                        include:{
                            User:true
                        }
                    },
                    
                },
                orderBy:{
                    created_at:'desc'
                },
                ...paginate
            });

            wishList.map(async(wishlistdetails)=>{
                wishlistdetails.Course.thumbnail_link = addPhotoPrefix(wishlistdetails.Course.thumbnail_link)
                wishlistdetails.Course.User.photo = addPhotoPrefix(wishlistdetails.Course.User.photo)
                delete wishlistdetails.Course.User.password
            })

            const data = {
                list: wishList,
                meta: await paginationMetaData('wishList', payload),
              };

              return successResponse('Wishlist by paginate for user', data);
        }catch(error){
            processException(error);
        }
    }

    async removeCourseWishList(user:User, wishlist_id:number)
    {
        try{
            const wishlistDetails = await PrismaClient.wishList.findFirst({
                where:{
                    id:wishlist_id,
                    studentId:user.id
                }
            });

            if(!wishlistDetails)
            {
                return errorResponse('Invalid Request!');
            }

            return successResponse('Course is removed from wishList successfully!');
        }catch(error){
            processException(error);
        }
    }
}