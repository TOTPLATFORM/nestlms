"use client";
import React, { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { InputType } from "./InputType";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DynamicAddRemoveLists({
  form,
  formName = "dynamic_add_remove_lists",
  formLabel,
  formPlaceholder,
  formDescription,
  isErrorMessageShow,
  disabled = false,
  existingListsString = "",
}: any) {
  const { t } = useTranslation();
  const [lists, setLists] = useState<any>([
    {
      id: 1,
      list: "",
    },
  ]);
  const addItem = () => {
    let maxId = 0;
    maxId = lists?.length
      ? lists.reduce(
          (max: number, item: any) => (item.id > max ? item.id : max),
          lists[0].id
        )
      : 0;

    setLists([
      ...lists,
      {
        id: maxId + 1,
        list: "",
      },
    ]);
  };

  const removeItem = (item: any) => {
    const updatedItems = lists.filter((data: any) => data.id != item.id);
    setLists(updatedItems);

    const itemIndex = lists.findIndex((data: any) => data.id == item.id);
    if (itemIndex != -1) {
      const fieldName = `${formName}[${item.id}]`;
      form.setValue(`${fieldName}.list`, "");
    }
  };

  const handleWhatYouWillLearnLists = (data: any) => {
    if (!data) {
      return;
    }
    const arrayFromString = data.split(",");

    const transformedArray = arrayFromString.map((value: any, index: any) => {
      return { id: index + 1, list: value };
    });

    setLists(transformedArray);

    transformedArray.map((item: any) => {
      const fieldName = `${formName}[${item.id}].list`;
      const value = item.list;
      form.setValue(fieldName, value);
    });
  };

  useEffect(() => {
    if (!existingListsString) {
      return;
    }
    handleWhatYouWillLearnLists(existingListsString);
  }, [existingListsString]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <label className=" text-sm">{t(formLabel)}</label>

        <button
          type="button"
          className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full"
          onClick={() => addItem()}
        >
          <IoIosAdd size={20} />
        </button>
      </div>
      {lists.map((item: any) => {
        return (
          <div className="mb-2 flex w-full items-center gap-4" key={item.id}>
            <InputType
              form={form}
              formName={`${formName}[${item.id}].list`}
              formLabel={""}
              formPlaceholder={formPlaceholder}
              formDescription={null}
              isErrorMessageShow={false}
              className="!w-full"
            />
            {lists.length > 1 && (
              <button type="button" onClick={() => removeItem(item)}>
                <X className="h-4 w-4 text-red-600" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
