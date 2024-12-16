import React from "react";
import { IoIosStar } from "react-icons/io";
import { IoIosStarOutline } from "react-icons/io";

export default function TestimonialSection() {
  return (
    <section className="relative bg-[#F5F5F5] pb-28">
      <div className="container">
        <div className="before:w-[calc(100% - 80px)] before:bg-primary/30 relative mx-auto max-w-[1100px] py-[65px] before:absolute before:left-[40px] before:right-[40px] before:top-0 before:h-full">
          <div className="relative">
            <div className="mx-auto max-w-xl pb-10 text-center">
              <span className="text-primary before:bg-primary after:bg-primary relative pl-[55px] pr-[105px] text-lg font-bold capitalize before:absolute before:left-0 before:top-1/2 before:h-[3px] before:w-[41px] after:absolute after:right-0 after:top-1/2 after:h-[3px] after:w-[90px] min-[1200px]:text-2xl">
                Testimonial
              </span>
              <h2 className="mb-2.5 text-5xl font-bold">
                Review's From Students
              </h2>
              <p className="text-[#4A5355]">
                A captain of the Navy ought to be a man of strong and sense
                education, dictumst a gentleman, as well as a seaman both in
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-10">
              {[1, 2].map((item) => (
                <div
                  className="rounded-[8px] bg-white p-10 shadow-lg"
                  key={item}
                >
                  <div className="flex items-center gap-1 pb-2.5">
                    <IoIosStar color="#FFA41B" size={18} />
                    <IoIosStar color="#FFA41B" size={18} />
                    <IoIosStar color="#FFA41B" size={18} />
                    <IoIosStarOutline color="#FFA41B" size={18} />
                    <IoIosStarOutline color="#FFA41B" size={18} />
                  </div>
                  <div>
                    <p>
                      “Sam is somebody you need as a steward of your brand. He’s
                      able to craft compelling brand narratives that company’s
                      vision to life We care about safety big time — and so do
                      your site's visitors. With a Shared Hosting account-LMS
                      site..”
                    </p>
                  </div>
                  <div className="flex items-center gap-x-4 pt-[25px]">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-full border">
                      <img src="/images/profile-pic.jpeg" alt="" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold">Jerome Bell</h2>
                      <p className="text-sm">Project Manager</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
