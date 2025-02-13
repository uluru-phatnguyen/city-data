import React, { useEffect, useMemo, useState } from "react";
import { Container, Popup, Table } from "@components";
import { createColumnHelper } from "@tanstack/react-table";
import { formatNumber } from "@utils";
import dayjs from "dayjs";
import { Electricity } from "@types";
import { useMutation, useQuery } from "react-query";
import {
  createElectricityService,
  getListElectricityService,
  uploadElectricityService,
} from "src/services";
import { useForm } from "react-hook-form";

// Define table columns
const columnHelper = createColumnHelper<Electricity>();
const columns = [
  columnHelper.accessor("id", {
    header: "Id",
  }),
  columnHelper.accessor("cityId", {
    header: "City Id",
  }),
  columnHelper.accessor("provider", {
    header: "Provider",
  }),
  columnHelper.accessor("consumption", {
    header: "Consumption",
    cell: (info) => formatNumber(info.getValue()),
  }),
  columnHelper.accessor("outages", {
    header: "Outages",
    cell: (info) => formatNumber(info.getValue()),
  }),
  columnHelper.accessor("renewablePercentage", {
    header: "Renewable Percentage",
    cell: (info) => formatNumber(info.getValue()),
  }),
  columnHelper.accessor("dateRecorded", {
    header: "Date recorded",
    cell: (info) => dayjs(info.getValue()).format("DD/MM/YYYY HH:mm:ss"),
  }),
  columnHelper.accessor("source", {
    header: "Source",
  }),
];

const ElectricityPage: React.FC = () => {
  const [cityId, setCityId] = useState<any>("0");
  const [file, setFile] = useState<any>();
  const { register, handleSubmit, reset } = useForm();
  const [showPopup, setShowPopup] = useState(false);
  const [showImportPopup, setShowImportPopup] = useState(false);

  const listQuery = useQuery({
    queryKey: "getList",
    queryFn: () => getListElectricityService(),
    retry: 0,
  });

  const createMutation = useMutation({
    mutationKey: "onCreate",
    mutationFn: createElectricityService,
    onSuccess: () => {
      listQuery.refetch();
      setShowPopup(false);
      setShowImportPopup(false);
    },
  });

  const importMutation = useMutation({
    mutationKey: "import",
    mutationFn: uploadElectricityService,
    onSuccess: () => {
      listQuery.refetch();
      setShowPopup(false);
      setShowImportPopup(false);
    },
  });

  const data = useMemo(
    () => listQuery?.data?.data?.items || [],
    [listQuery?.data?.data?.items]
  );

  const loading = useMemo(() => listQuery?.isFetching, [listQuery?.isFetching]);

  useEffect(() => {
    if (showPopup) {
      reset({});
    }
  }, [showPopup]);

  useEffect(() => {
    if (showImportPopup) {
      setFile(null);
      setCityId("0");
    }
  }, [showImportPopup]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setFile(file);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const onSubmitFile = () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("cityId", cityId);
    importMutation.mutate(formData);
  }

  const onSubmit = handleSubmit((data) => {
    createMutation.mutate(data);
  });

  return (
    <Container>
      <Popup open={showPopup} onClose={() => setShowPopup(false)}>
        <div className="flex justify-between items-center border-b pb-2 mb-4 p-3">
          <h2 className="text-xl font-semibold">Water Supply</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowPopup(false)}
          >
            &times;
          </button>
        </div>
        <div className="p-3">
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">City Id</label>
              <select {...register("cityId")} id="cityId" name="cityId" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-9 pl-3">
                <option value="">--</option>
                <option value="1">Ha Noi</option>
                <option value="2">Ho Chi Minh</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Provider</label>
              <input
                type="text"
                {...register("provider")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-9 pl-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Consumption</label>
              <input
                type="number"
                {...register("consumption")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-9 pl-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Outages</label>
              <input
                type="number"
                {...register("outages")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-9 pl-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Renewable Percentage
              </label>
              <input
                type="number"
                {...register("renewablePercentage")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-9 pl-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Date Recorded</label>
              <input
                type="datetime-local"
                {...register("dateRecorded")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-9 pl-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Source</label>
              <select {...register("source")} id="source" name="source" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-9 pl-3">
                <option value="">--</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </Popup>
      <Popup open={showImportPopup} onClose={() => setShowImportPopup(false)}>
        <div className="flex justify-between items-center border-b pb-2 mb-4 p-3">
          <h2 className="text-xl font-semibold">Import CSV</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowImportPopup(false)}
          >
            &times;
          </button>
        </div>
        <div className="p-3">
          <label className="block text-gray-700">City</label>
          <select value={cityId} onChange={(e)=>{ setCityId(e?.target?.value); }} id="cityId" name="cityId" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-9 pl-3">
            <option value="0">--</option>
            <option value="1">Ha Noi</option>
            <option value="2">Ho Chi Minh</option>
          </select>
        </div>
        <div className="p-3">
          <input type="file" accept=".csv" onChange={handleFileUpload} />
        </div>
        <div className="w-full flex justify-end">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={()=>{ onSubmitFile(); }}>Upload</button>
        </div>
      </Popup>

      <div className="flex justify-between mb-4 items-center">
        <div className="text-xl font-semibold">Electricity</div>
        <div>
          <button
            onClick={() => setShowPopup(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            ╋ Create
          </button>

          <button
            onClick={() => setShowImportPopup(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md ml-2"
          >
            ⬆ Import
          </button>
        </div>
      </div>
      {loading && (
        <div className="flex justify-center items-center">
          <p>Loading...</p>
        </div>
      )}
      {!loading && <Table data={data} columns={columns} />}
    </Container>
  );
};

export default ElectricityPage;
