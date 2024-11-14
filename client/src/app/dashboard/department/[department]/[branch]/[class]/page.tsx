'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

const SemesterPage = () => {
    const [uni_id, setUni_id] = useState('');
    const [semester_id, setSemester_id] = useState(0);
    const [semesterData, setSemesterData] = useState([{
        id: 0,
        sem_no: 0,
        class_id: 0,
        subject_id: [],
        faculty_id: []
    }]);
    const router = useRouter();
    const params = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputData, setInputData] = useState({
        sem_no: 0,
        class_id: 0,
        subject_id: [],
        faculty_id: []
    });

    const dept_id = params.department;
    const branch_id = params.branch;
    const class_id = params.class;

    useEffect(() => {
        get_uni_id();
    }, []);

    const get_uni_id = async () => {
        let customData;
        await fetch(window.location.href)
           .then((res) => {
                customData = res.headers.get('uni_id');
                if (customData) {
                    setUni_id(customData);
                }
            })
            .catch((error) => console.log("Error fetching data", error)
        );

        await getSemesterData(customData);
    };
    
    const getSemesterData = async (uni_id : any) => {
        const response = await fetch(`http://localhost:3000/api/university/${uni_id}/department/${dept_id}/branch/${branch_id}/class/${class_id}/semester`);
        const data = await response.json();
        // console.log(`http://localhost:3000/api/university/${uni_id}/department/${dept_id}/branch/${branch_id}/class/${class_id}/semester`)
        if (Array.isArray(data.data)) {
            setSemesterData(data.data);
            console.log("sesm " , semesterData);
        } else {
            setSemesterData([]);
        }
        await getSubjectName();
    };

    const getSubjectName = async () => {
        return semesterData.map(async (data) => {
            console.log("dataaa:",data);
            return data.subject_id.map(async (subject_id) => {
                const response = await fetch(`http://localhost:3000/api/university/${uni_id}/department/${dept_id}/branch/${branch_id}/class/${class_id}/subject/${subject_id}`);
                const data = await response.json();
                return data.data[0].subject_name;   
            });
        });
    }
    // console.log(getSubjectName());

    const handle_delete = async (semester_id : any) => {
        const response = await fetch(
            `http://localhost:3000/api/university/${uni_id}/department/${dept_id}/branch/${branch_id}/class/${class_id}/semester/${semester_id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await response.json();
        if (data.status === 201) {
            console.log("Data successfully deleted:", data);
            setSemesterData(semesterData.filter((data) => data.id !== semester_id));
            router.refresh();
        } else {
            console.error("Error deleting data:", data);
        }
    };

    const handle_insert = () => {
        setIsModalOpen(true);
    };

    const handle_edit = (sem_no : any, class_id : any, subject_id : any, faculty_id : any) => {
        setIsModalOpen(true);
        setInputData({ sem_no, class_id, subject_id, faculty_id });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url =
                semester_id === 0
                    ? `http://localhost:3000/api/university/${uni_id}/department/${dept_id}/branch/${branch_id}/class/${class_id}/semester`
                    : `http://localhost:3000/api/university/${uni_id}/department/${dept_id}/branch/${branch_id}/class/${class_id}/semester/${semester_id}`;
    
            const method = semester_id === 0 ? "POST" : "PUT";
    
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sem_no: inputData.sem_no,
                    class_id: inputData.class_id,
                    subject_id: inputData.subject_id,
                    faculty_id: inputData.faculty_id
                }),
            });
            const result = await response.json();
            console.log("Data successfully posted:", result);

            if (result.function_name === "update_semester") {
                setSemesterData((prevSemester) =>
                    prevSemester.map((sem) =>
                        sem.id === semester_id
                            ? { ...sem, ...inputData }
                            : sem
                    )
                );
            }
    
            if (result.function_name === "create_semester") {
                setSemesterData((prevSemester) => [
                    ...prevSemester,
                    result.data[0],
                ]);
            }
    
            setIsModalOpen(false);
            setInputData({
                sem_no: 0,
                class_id: 0,
                subject_id: [],
                faculty_id: []
            });
            setSemester_id(0); 
            router.refresh();
        } catch (error) {
            console.error("Error posting data:", error);
        }
    };

    const get_semester_data = semesterData.map((data, index) => (
        <div
            className="shadow-md hover:bg-slate-100 flex flex-col justify-center items-center w-full p-5 gap-0 font-bold rounded-sm"
            key={index}>
            <p className="text-lg text-slate-900">ID: {data.id}</p>
            <p className="text-2xl text-slate-950">Semester No: {data.sem_no}</p>
            <p className="text-2xl text-slate-950">Class ID: {data.class_id}</p>
            <p className="text-xl text-slate-950">Subjects: {data.subject_id.join(', ')}</p>
            <p className="text-xl text-slate-950">Faculties: {data.faculty_id.join(', ')}</p>
            <div className="flex gap-1 mt-5">
                <button
                    onClick={() => {
                        handle_edit(data.sem_no, data.class_id, data.subject_id, data.faculty_id);
                        setSemester_id(data.id);
                    }}
                    className="bg-green-600 px-3 py-1 rounded-md"
                >
                    <LuPencil size={20} className="text-white" />
                </button>
                <button
                    onClick={() => handle_delete(data.id)}
                    className="bg-red-600 px-3 py-1 rounded-md"
                >
                    <IoClose size={20} className="text-white" />
                </button>
            </div>
        </div>
    ));

    return (
        <div className="flex flex-col gap-6 justify-center items-center p-5 w-full">
            <div className="flex justify-between w-full">
                <div className="text-3xl font-bold text-slate-950">Semester</div>
                <button
                    onClick={handle_insert}
                    className="flex gap-1 justify-center items-center text-xl bg-blue-600 py-1 px-3 text-white rounded-md"
                >
                    <FaPlus /> <div>New</div>
                </button>

                {isModalOpen && (
                    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-lg font-bold mb-4">Add New Semester</h2>
                            <form onSubmit={handleSubmit}>
                                <label className='text-sm font-semibold'>Semester No.</label>
                                <input
                                    type="number"
                                    value={inputData.sem_no || ''}
                                    placeholder="Enter Semester Number"
                                    onChange={(e) => setInputData({ ...inputData, sem_no: Number(e.target.value) })}
                                    className="mb-3 p-2 border border-gray-300 rounded-md w-full"
                                />
                                <label className='text-sm font-semibold'>Class ID</label>
                                <input
                                    type="number"
                                    value={inputData.class_id || ''}
                                    placeholder="Enter Class ID"
                                    onChange={(e) => setInputData({ ...inputData, class_id: Number(e.target.value) })}
                                    className="mb-3 p-2 border border-gray-300 rounded-md w-full"
                                />
                                <label className='text-sm font-semibold'>Subject IDs (comma-separated)</label>
                                <input
                                    type="text"
                                    value={inputData.subject_id.join(', ') || ''}
                                    placeholder="Enter Subject IDs"
                                    onChange={(e) => setInputData({ ...inputData, subject_id: e.target.value.split(',').map(Number) })}
                                    className="mb-3 p-2 border border-gray-300 rounded-md w-full"
                                />
                                <label className='text-sm font-semibold'>Faculty IDs (comma-separated)</label>
                                <input
                                    type="text"
                                    value={inputData.faculty_id.join(', ') || ''}
                                    placeholder="Enter Faculty IDs"
                                    onChange={(e) => setInputData({ ...inputData, faculty_id: e.target.value.split(',').map(Number) })}
                                    className="p-2 border border-gray-300 rounded-md w-full"
                                />

                                <div className="mt-4">
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Submit</button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="ml-2 bg-red-600 text-white px-4 py-2 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-3 w-full">
                {get_semester_data}
            </div>
        </div>
    );
};

export default SemesterPage;
