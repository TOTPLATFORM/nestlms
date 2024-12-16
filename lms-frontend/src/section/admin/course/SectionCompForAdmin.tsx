"use client";
import CustomModal from "@/components/modal/CustomModal";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoAdd } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";

import { AiOutlineDelete } from "react-icons/ai";

import { IoChevronDownOutline } from "react-icons/io5";
import AnimateHeight from "react-animate-height";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { InputType } from "@/components/form/InputType";
import LoaderButton from "@/components/button/LoaderButton";

import { itemDeleteHandler } from "@/lib/helper";
import CreateSectionCompForAdmin from "./CreateSectionCompForAdmin";
import EditSectionCompForAdmin from "./EditSectionCompForAdmin";
import CreateLessonCompForAdmin from "./CreateLessonCompForAdmin";
import EditLessonCompForAdmin from "./EditLessonCompForAdmin";
import { useRouter } from "next-nprogress-bar";
import { toast } from "react-toastify";
import LessonSkelaton from "@/components/skelaton/LessonSkelaton";
import {
  useDeleteLessonForAdminItem,
  useDeleteSectionForAdminItem,
  useGetLessonForAdminBySectionId,
  useGetSectionForAdminById,
} from "@/hooks/admin/course.hook";
import NoItem from "@/components/NoItem";

export default function SectionCompForAdmin({ courseId, setActiveTab }: any) {
  const router = useRouter();
  const { handleDelete } = useDeleteSectionForAdminItem();
  const { handleDeleteLesson } = useDeleteLessonForAdminItem();

  const handleDeleteItem = (item: any) => itemDeleteHandler(item, handleDelete);
  const handleDeleteItemForLesson = (item: any) =>
    itemDeleteHandler(item, handleDeleteLesson);

  const [openModal, setOpenModal] = useState(false);

  const [openModalForLesson, setOpenModalForLesson] = useState<any>(false);

  const [selectedSectionId, setSelectedSectionId] = useState<any>("");

  const [selectedSection, setSelectedSection] = useState<any>("");

  const [addOrEdit, setAddOrEdit] = useState("");
  const [addOrEditForLesson, setAddOrEditForLesson] = useState("");

  const [activeAcc, setActiveAcc] = useState<any>(0);

  const [activeAccForLesson, setActiveAccForLesson] = useState<any>(0);

  const [activeLesson, setActiveLesson] = useState<any>({});

  const [editSection, setEditSection] = useState<any>("");

  const closeModal = () => {
    setOpenModal(false);
  };

  const closeModalForLesson = () => {
    setOpenModalForLesson(false);
  };

  const { data: sectionLists, isLoading: sectionLoading } =
    useGetSectionForAdminById(courseId);

  const { data: lessonLists, isLoading: lessonLoading } =
    useGetLessonForAdminBySectionId(selectedSectionId);

  useEffect(() => {
    if (!courseId) {
      setActiveTab(1);
      return;
    }
  }, [courseId]);

  const activeSectionHandler = (sectionId: any) => {
    if (activeAcc == sectionId) {
      setActiveAcc(0);
      setSelectedSectionId("");
      return;
    }
    setActiveAcc(sectionId);
    setSelectedSectionId(sectionId);
  };

  const activeLessonHandler = (lesson: any) => {
    if (activeAccForLesson == lesson.id) {
      setActiveAccForLesson(0);
      setActiveLesson({});
      return;
    }
    setActiveAccForLesson(lesson.id);
    setActiveLesson(lesson);
  };

  return (
    <>
      <div className="panel rounded-md border-2">
        <Button
          type="button"
          className="w-fit"
          onClick={() => {
            setOpenModal(true);
            setAddOrEdit("add");
          }}
        >
          New Section
        </Button>
        {sectionLoading ? (
          <LessonSkelaton />
        ) : !sectionLists?.data || sectionLists?.data?.length === 0 ? (
          <NoItem notFoundtext={`No results.`} />
        ) : (
          <div className="mt-8 flex flex-col gap-y-8">
            {sectionLists?.data?.map((item: any) => (
              <div
                className="rounded-[8px] custom-inner-shadow bg-white px-[20px] py-[30px]"
                key={item.id}
              >
                <div
                  className={`flex items-center justify-between  ${
                    activeAcc === item.id && "mb-4 border-b pb-[20px] "
                  }`}
                >
                  <div className="flex items-center gap-x-3">
                    <div className="bg-primary rounded-full p-2">
                      <LuLayoutDashboard size={24} color="#fff" />
                    </div>
                    <div>
                      <h2 className="font-bold">{item.title}</h2>
                      <p className="text-xs">3 Topic | 0:00 Hr</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-4">
                    <div
                      className="bg-primary/30 cursor-pointer rounded-full p-1"
                      onClick={() => {
                        setOpenModalForLesson(true);
                        setAddOrEditForLesson("add");
                        setSelectedSection(item);
                      }}
                    >
                      <IoAdd size={20} className="text-primary" />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setOpenModal(true);
                        setAddOrEdit("edit");
                        setEditSection(item);
                      }}
                    >
                      <CiEdit size={20} />
                    </div>
                    <div
                      onClick={() => handleDeleteItem(item.id)}
                      className="cursor-pointer"
                    >
                      <AiOutlineDelete size={20} />
                    </div>
                    <div
                      onClick={() => {
                        activeSectionHandler(item.id);
                      }}
                      className="cursor-pointer"
                    >
                      <IoChevronDownOutline size={20} />
                    </div>
                  </div>
                </div>
                <AnimateHeight height={activeAcc === item.id ? "auto" : 0}>
                  {lessonLoading ? (
                    <LessonSkelaton />
                  ) : !lessonLists ||
                    !lessonLists?.data ||
                    lessonLists?.data?.length === 0 ? (
                    <NoItem notFoundtext={`No results.`} />
                  ) : (
                    <div className="mt-8 flex flex-col gap-y-8">
                      {lessonLists?.data?.map((lesson: any) => (
                        <div
                          className="rounded-[8px] custom-inner-shadow bg-white px-[20px] py-[30px]"
                          key={lesson.id}
                        >
                          <div
                            className={`flex items-center justify-between  ${
                              activeAccForLesson === lesson.id &&
                              "mb-4 border-b pb-[20px] "
                            }`}
                          >
                            <div className="flex items-center gap-x-3">
                              <div className="rounded-full bg-[#f1f1f1] p-2">
                                <LuLayoutDashboard size={24} color="#818894" />
                              </div>
                              <div>
                                <h2 className="font-bold">{lesson.title}</h2>
                              </div>
                            </div>
                            <div className="flex items-center gap-x-4">
                              <div
                                onClick={() =>
                                  handleDeleteItemForLesson(lesson.id)
                                }
                                className="cursor-pointer"
                              >
                                <AiOutlineDelete size={20} />
                              </div>
                              <div
                                onClick={() => {
                                  activeLessonHandler(lesson);
                                }}
                                className="cursor-pointer"
                              >
                                <IoChevronDownOutline size={20} />
                              </div>
                            </div>
                          </div>
                          <AnimateHeight
                            height={
                              activeAccForLesson === lesson.id ? "auto" : 0
                            }
                          >
                            {activeLesson?.id &&
                              activeLesson?.id == lesson.id && (
                                <EditLessonCompForAdmin
                                  activeLesson={activeLesson}
                                />
                              )}
                          </AnimateHeight>
                        </div>
                      ))}
                    </div>
                  )}
                </AnimateHeight>
              </div>
            ))}
          </div>
        )}

        <Button
          type="button"
          color="gray"
          onClick={() => {
            router.push("/instructor/courses");
            toast.success(`Course Created Successfully`);
          }}
          className="mt-8"
        >
          Finish
        </Button>
      </div>
      <CustomModal
        header={addOrEdit == "add" ? `Add New Section` : `Edit Section`}
        close={closeModal}
        isModalOpen={openModal}
        modalSize={"2xl"}
        modalPlacement={"center"}
      >
        <div className="space-y-6">
          {addOrEdit == "add" ? (
            <CreateSectionCompForAdmin
              closeModal={closeModal}
              courseId={courseId}
            />
          ) : (
            <EditSectionCompForAdmin
              closeModal={closeModal}
              editSection={editSection}
            />
          )}
        </div>
      </CustomModal>
      <CustomModal
        header={addOrEditForLesson == "add" ? `Add New Lesson` : `Edit Lesson`}
        close={closeModalForLesson}
        isModalOpen={openModalForLesson}
        modalSize={"5xl"}
        modalPlacement={"center"}
      >
        <div className="space-y-6">
          {addOrEditForLesson == "add" ? (
            <CreateLessonCompForAdmin
              closeModal={closeModalForLesson}
              selectedSection={selectedSection}
            />
          ) : (
            <EditSectionCompForAdmin
              closeModal={closeModal}
              editSection={editSection}
            />
          )}
        </div>
      </CustomModal>
    </>
  );
}
