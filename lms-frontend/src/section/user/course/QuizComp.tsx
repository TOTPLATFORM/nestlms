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
import {
  useAddSectionFormHandler,
  useDeleteAnswerItem,
  useDeleteLessonItem,
  useDeleteQuestionItem,
  useDeleteQuizItem,
  useDeleteSectionItem,
  useGetAnswerByQuestionId,
  useGetLessonBySectionId,
  useGetQuestionByQuizId,
  useGetQuizByCourseId,
  useGetSectionById,
} from "@/hooks/user/course.hook";
import { itemDeleteHandler } from "@/lib/helper";
import CreateSectionComp from "./CreateSectionComp";
import EditSectionComp from "./EditSectionComp";
import CreateLessonComp from "./CreateLessonComp";
import EditLessonComp from "./EditLessonComp";
import { useRouter } from "next-nprogress-bar";
import { toast } from "react-toastify";
import LessonSkelaton from "@/components/skelaton/LessonSkelaton";
import { useTranslation } from "react-i18next";
import CreateQuizComp from "./quiz/CreateQuizComp";
import EditQuizComp from "./quiz/EditQuizComp";
import CreateQuestionComp from "./quiz/CreateQuestionComp";
import EditQuestionComp from "./quiz/EditQuestionComp";
import { MdOutlineQuiz } from "react-icons/md";
import { BsPatchQuestion } from "react-icons/bs";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import CreateAnswerComp from "./quiz/CreateAnswerComp";
import EditAnswerComp from "./quiz/EditAnswerComp";
import NoItem from "@/components/NoItem";

export default function QuizComp({ courseId, setActiveTab }: any) {
  const router = useRouter();
  const { handleDelete } = useDeleteQuizItem();
  const { handleDeleteQuestion } = useDeleteQuestionItem();
  const { handleDeleteAnswer } = useDeleteAnswerItem();

  const { t } = useTranslation();

  const handleDeleteQuizItem = (item: any) =>
    itemDeleteHandler(item, handleDelete);

  const handleDeleteItemForQuestion = (item: any) =>
    itemDeleteHandler(item, handleDeleteQuestion);

  const handleDeleteItemForAnswer = (item: any) =>
    itemDeleteHandler(item, handleDeleteAnswer);

  const [openModal, setOpenModal] = useState(false);

  const [openModalForQuestion, setOpenModalForQuestion] = useState<any>(false);

  const [openModalForAnswer, setOpenModalForAnswer] = useState<any>(false);

  const [selectedQuizId, setSelectedQuizId] = useState<any>("");

  const [selectedQuestionId, setSelectedQuestionId] = useState<any>("");

  const [selectedQuiz, setSelectedQuiz] = useState<any>("");

  const [selectedQuestion, setSelectedQuestion] = useState<any>("");

  const [addOrEdit, setAddOrEdit] = useState("");

  const [addOrEditForQuiz, setAddOrEditForQuestion] = useState("");

  const [addOrEditForAnswer, setAddOrEditForAnswer] = useState("");

  const [activeAcc, setActiveAcc] = useState<any>(0);

  const [activeAccForQuestion, setActiveAccForQuestion] = useState<any>(0);

  const [activeAccForAnswer, setActiveAccForAnswer] = useState<any>(0);

  const [activeQuestion, setActiveQuestion] = useState<any>({});

  const [activeAnswer, setActiveAnswer] = useState<any>({});

  const [editQuiz, setEditQuiz] = useState<any>("");

  const closeModal = () => {
    setOpenModal(false);
  };

  const closeModalForQuestion = () => {
    setOpenModalForQuestion(false);
  };

  const closeModalForAnswer = () => {
    setOpenModalForAnswer(false);
  };

  const { data: sectionLists, isLoading: sectionLoading } =
    useGetSectionById(courseId);

  const { data: quizLists, isLoading: quizLoading } =
    useGetQuizByCourseId(courseId);

  const { data: questionLists, isLoading: questionLoading } =
    useGetQuestionByQuizId(selectedQuizId);

  const { data: answerLists, isLoading: answerLoading } =
    useGetAnswerByQuestionId(selectedQuestionId);

  useEffect(() => {
    if (!courseId) {
      setActiveTab(1);
      return;
    }
  }, [courseId]);

  const activeQuizHandler = (quizId: any) => {
    if (activeAcc == quizId) {
      setActiveAcc(0);
      setSelectedQuizId("");
      return;
    }
    setActiveAcc(quizId);
    setSelectedQuizId(quizId);
  };

  const activeQuestionHandler = (question: any) => {
    if (activeAccForQuestion == question.id) {
      setActiveAccForQuestion(0);
      setSelectedQuestionId("");
      return;
    }
    setActiveAccForQuestion(question.id);
    setSelectedQuestionId(question.id);
  };

  const activeAnswerHandler = (answer: any) => {
    if (activeAccForAnswer == answer.id) {
      setActiveAccForAnswer(0);
      setActiveAnswer({});
      return;
    }
    setActiveAccForAnswer(answer.id);
    setActiveAnswer(answer);
  };

  if (sectionLoading)
    return (
      <div className="panel rounded-md border-2">
        <LessonSkelaton />
      </div>
    );
  if (!sectionLists?.data || sectionLists?.data?.length === 0)
    return (
      <div className="panel rounded-md border-2">
        <div className="my-8 flex h-24 flex-col items-center justify-center gap-4 rounded-[8px] border md:flex-row">
          <p>{t(`Please Add Section First`)} </p>

          <p
            className="text-primary cursor-pointer underline"
            onClick={() => setActiveTab(4)}
          >
            {t(`Back To Curriculum`)}
          </p>
        </div>
        <Button
          type="button"
          color="gray"
          onClick={() => {
            router.push("/instructor/courses");
            toast.success(`Course Created Successfully`);
          }}
        >
          Finish
        </Button>
      </div>
    );

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
          New Quiz
        </Button>
        {sectionLoading ? (
          <LessonSkelaton />
        ) : quizLists?.data?.list?.length === 0 ? (
          <NoItem notFoundtext={`No Results.`} />
        ) : (
          <div className="mt-8 flex flex-col gap-y-8">
            {quizLists?.data?.list?.map((item: any) => (
              <div
                className="custom-inner-shadow rounded-[8px] bg-white px-[20px] py-[30px]"
                key={item.id}
              >
                <div
                  className={`flex items-center justify-between  ${
                    activeAcc === item.id && "mb-4 border-b pb-[20px] "
                  }`}
                >
                  <div className="flex items-center gap-x-3">
                    <div className="bg-primary rounded-full p-2">
                      <MdOutlineQuiz size={24} color="#fff" />
                    </div>
                    <div>
                      <h2 className="font-bold">{item.title}</h2>
                      <div className="text-xs">
                        {item.total_question} Questions |{" "}
                        <span
                          className={
                            item.status == 1 ? "text-primary" : "text-red-600"
                          }
                        >
                          {item.status == 1 ? "Active" : "In-Active"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-4">
                    <div
                      className="bg-primary/30 cursor-pointer rounded-full p-1"
                      onClick={() => {
                        setOpenModalForQuestion(true);
                        setAddOrEditForQuestion("add");
                        setSelectedQuiz(item);
                      }}
                    >
                      <IoAdd size={20} className="text-primary" />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setOpenModal(true);
                        setAddOrEdit("edit");
                        setEditQuiz(item);
                      }}
                    >
                      <CiEdit size={20} />
                    </div>
                    <div
                      onClick={() => handleDeleteQuizItem(item.id)}
                      className="cursor-pointer"
                    >
                      <AiOutlineDelete size={20} />
                    </div>
                    <div
                      onClick={() => {
                        activeQuizHandler(item.id);
                      }}
                      className="cursor-pointer"
                    >
                      <IoChevronDownOutline size={20} />
                    </div>
                  </div>
                </div>

                <AnimateHeight height={activeAcc === item.id ? "auto" : 0}>
                  {questionLoading ? (
                    <LessonSkelaton />
                  ) : !questionLists ||
                    !questionLists?.data ||
                    questionLists?.data?.length === 0 ? (
                    <NoItem notFoundtext={`No Results.`} />
                  ) : (
                    <div className="mt-8 flex flex-col gap-y-8">
                      {questionLists?.data?.map((question: any) => (
                        <div
                          className="custom-inner-shadow rounded-[8px] bg-white px-[20px] py-[30px]"
                          key={question.id}
                        >
                          <div
                            className={`flex items-center justify-between  ${
                              activeAccForQuestion === question.id &&
                              "mb-4 border-b pb-[20px] "
                            }`}
                          >
                            <div className="flex items-center gap-x-3">
                              <div className="bg-primary/50 rounded-full p-2">
                                <BsPatchQuestion size={24} color="#ffffff" />
                              </div>
                              <div>
                                <h2 className="font-bold">{question.title}</h2>
                              </div>
                            </div>
                            <div className="flex items-center gap-x-4">
                              <div
                                className="bg-primary/30 cursor-pointer rounded-full p-1"
                                onClick={() => {
                                  setOpenModalForAnswer(true);
                                  setAddOrEditForAnswer("add");
                                  setSelectedQuestion(question);
                                }}
                              >
                                <IoAdd size={20} className="text-primary" />
                              </div>
                              <div
                                className="cursor-pointer"
                                onClick={() => {
                                  setOpenModalForQuestion(true);
                                  setAddOrEditForQuestion("edit");
                                  setSelectedQuestion(question);
                                }}
                              >
                                <CiEdit size={20} />
                              </div>
                              <div
                                onClick={() =>
                                  handleDeleteItemForQuestion(question.id)
                                }
                                className="cursor-pointer"
                              >
                                <AiOutlineDelete size={20} />
                              </div>
                              <div
                                onClick={() => {
                                  activeQuestionHandler(question);
                                }}
                                className="cursor-pointer"
                              >
                                <IoChevronDownOutline size={20} />
                              </div>
                            </div>
                          </div>

                          <AnimateHeight
                            height={
                              activeAccForQuestion === question.id ? "auto" : 0
                            }
                          >
                            {answerLoading ? (
                              <LessonSkelaton />
                            ) : !answerLists ||
                              !answerLists?.data ||
                              answerLists?.data?.length === 0 ? (
                              <NoItem notFoundtext={`No Results.`} />
                            ) : (
                              <div className="mt-8 flex flex-col gap-y-8">
                                {answerLists?.data?.map((answer: any) => (
                                  <div
                                    className="custom-inner-shadow rounded-[8px] bg-white px-[20px] py-[30px]"
                                    key={answer.id}
                                  >
                                    <div
                                      className={`flex items-center justify-between  ${
                                        activeAccForAnswer === answer.id &&
                                        "mb-4 border-b pb-[20px] "
                                      }`}
                                    >
                                      <div className="flex items-center gap-x-3">
                                        <div className="rounded-full bg-[#f1f1f1] p-2">
                                          <MdOutlineQuestionAnswer
                                            size={24}
                                            color="#818894"
                                          />
                                        </div>
                                        <div>
                                          <h2 className="font-bold">
                                            {answer.title}
                                          </h2>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-x-4">
                                        <div
                                          onClick={() =>
                                            handleDeleteItemForAnswer(answer.id)
                                          }
                                          className="cursor-pointer"
                                        >
                                          <AiOutlineDelete size={20} />
                                        </div>
                                        <div
                                          onClick={() => {
                                            activeAnswerHandler(answer);
                                          }}
                                          className="cursor-pointer"
                                        >
                                          <IoChevronDownOutline size={20} />
                                        </div>
                                      </div>
                                    </div>
                                    <AnimateHeight
                                      height={
                                        activeAccForAnswer === answer.id
                                          ? "auto"
                                          : 0
                                      }
                                    >
                                      {activeAnswer?.id &&
                                        activeAnswer?.id == answer.id && (
                                          <EditAnswerComp
                                            activeAnswer={activeAnswer}
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
        header={addOrEdit == "add" ? `Add New Quiz` : `Edit Quiz`}
        close={closeModal}
        isModalOpen={openModal}
        modalSize={"5xl"}
        modalPlacement={"center"}
      >
        <div className="space-y-6">
          {addOrEdit == "add" ? (
            <CreateQuizComp
              closeModal={closeModal}
              courseId={courseId}
              sections={sectionLists?.data}
            />
          ) : (
            <EditQuizComp
              closeModal={closeModal}
              editQuiz={editQuiz}
              sections={sectionLists?.data}
            />
          )}
        </div>
      </CustomModal>
      <CustomModal
        header={
          addOrEditForQuiz == "add" ? `Add New Question` : `Edit Question`
        }
        close={closeModalForQuestion}
        isModalOpen={openModalForQuestion}
        modalSize={"5xl"}
        modalPlacement={"center"}
      >
        <div className="space-y-6">
          {addOrEditForQuiz == "add" ? (
            <CreateQuestionComp
              closeModal={closeModalForQuestion}
              selectedQuiz={selectedQuiz}
            />
          ) : (
            <EditQuestionComp
              closeModal={closeModalForQuestion}
              selectedQuestion={selectedQuestion}
            />
          )}
        </div>
      </CustomModal>
      <CustomModal
        header={addOrEditForAnswer == "add" ? `Add New Answer` : `Edit Answer`}
        close={closeModalForAnswer}
        isModalOpen={openModalForAnswer}
        modalSize={"5xl"}
        modalPlacement={"center"}
      >
        <div className="space-y-6">
          {addOrEditForAnswer == "add" ? (
            <CreateAnswerComp
              closeModal={closeModalForAnswer}
              selectedQuestion={selectedQuestion}
            />
          ) : null}
        </div>
      </CustomModal>
    </>
  );
}
