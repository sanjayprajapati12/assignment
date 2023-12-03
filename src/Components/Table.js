import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import axios from "axios";
import del from "./del.svg"
import delBig from "./del-big.svg"
import edit from "./edit.svg"
import correct from "./correct.svg"
import wrong from "./wrong.svg"
import "./Table.css"

const Table = () => {
    const [data , setData] = useState();
    const [selectedData , setSelectedData] = useState();
    const [search,setSearch] = useState("");
    const [filterData , setFilterData] = useState();
    const [editableId , setEditableId] = useState(-1);
    const [LastName , setLastName ] = useState("");
    const [LastEmail , setLastEmail ] = useState("");
    const [LastRole , setLastRole ] = useState("");
    
    const getData = async()=>{
        try{
            const response = await axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
            setData(response.data);
            setFilterData(response.data);
        }
        catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        getData();
    },[])


    const handleRowChange = (state)=>{
        setSelectedData(state.selectedRows);
    }

    const handleSingleDelete = (id)=>{
        console.log(id);
        const newData = data.filter(object => {
            return (object.id !== id);
        });
        setData(newData);
        
        const newFilterData = filterData.filter(object =>{
            return (object.id !== id);
        })
        setFilterData(newFilterData);
    }

    const handleDelete = (del)=>{
        if(del!==undefined){
            const newData = data.filter((item1) => !del.some((item2) => item1.id === item2.id));
            setData(newData);
            
            const newFilterData = filterData.filter((item1) => !del.some((item2) => item1.id === item2.id));
            setFilterData(newFilterData);
        }
    }

    const handleEdit = (row)=>{
        if(editableId!==-1){
            const cur = data.filter((cur)=>{
                return (cur.id===editableId);
            })
            console.log("role " , cur[0].role);
            console.log("kya " , cur[0]);
            handleWrong(cur[0]);
        }
        setEditableId(row.id);
        setLastName(row.name);
        setLastEmail(row.email);
        setLastRole(row.role);
    }

    const handelCorrect = (row) =>{
        setEditableId(-1);
    }
    
    const handleWrong = (row) =>{
        row.name = LastName;
        row.email = LastEmail;
        row.role = LastRole;
        updateTableData(row);
        setEditableId(-1);
    }

    
    useEffect(()=>{
        if(search!==''){
            const result = data.filter((row) =>{
                return (row.name.toLowerCase().includes(search.toLocaleLowerCase()));
            })
            setFilterData(result);
        }
        else{
            setFilterData(data);
        }
    },[search])


    const isRowEditable = (row) => {
        return (row.id===editableId);
    }

    const updateTableData = (updatedRow) => {
        if(search===''){
            setData((prevData) => {
              const updatedData = prevData.map((row) =>
                row.id === updatedRow.id ? { ...row, ...updatedRow } : row
              );
              return updatedData;
            });
            setFilterData(data);
        }
        else{
            setData((prevData) => {
              const updatedData = prevData.map((row) =>
                row.id === updatedRow.id ? { ...row, ...updatedRow } : row
              );
              return updatedData;
            });
            setFilterData((prevData) => {
              const updatedData = prevData.map((row) =>
                row.id === updatedRow.id ? { ...row, ...updatedRow } : row
              );
              return updatedData;
            });
        }
    };


    const columns = [
        {
            name : "Name",
            selector : (row) => row.name,
            sortable : true,
            cell: (row) => (
                isRowEditable(row) ? (
                  <input
                    type="text"
                    value={row.name} 
                    onChange={(e) => {
                        row.name = e.target.value;
                        updateTableData(row);
                    }}
                  />
                ) : (
                  row.name
                )
              )
        },
        {
            name : "Email",
            selector : (row) =>row.email,
            cell: (row) => (
                isRowEditable(row) ? (
                  <input
                    type="text"
                    value={row.email} 
                    onChange={(e) => {
                        row.email = e.target.value;
                        updateTableData(row);
                    }}
                  />
                ) : (
                  row.email
                )
              )
        },
        {
            name : "Role",
            selector : (row)=>row.role,
            cell: (row) => (
                isRowEditable(row) ? (
                  <input
                    type="text"
                    value={row.role} 
                    onChange={(e) => {
                        row.role = e.target.value;
                        updateTableData(row);
                    }}
                  />
                ) : (
                  row.role
                )
              )
        },
        {
            name: "Action",
            cell : (row) => (
                <div className='action'>
                    {(editableId!==row.id) ? 
                        <div className='action'>
                            <img src={del} className="del-btn" onClick={()=> handleSingleDelete((row.id))} alt="del"/>
                            <img src={edit} className="edit-btn" onClick={()=> handleEdit(row)} alt="Edit"/>
                        </div>
                     : 
                        <div className='action'>
                            <img src={correct} className="correct-btn" onClick={()=> handelCorrect(row)} alt="correct"/>
                            <img src={wrong} className="wrong-btn" onClick={()=> handleWrong(row)} alt="wront"/>
                        </div>
                    }
                </div>
            )
        }
    ];

    const customStyle={
        headCells:{
            style:{
                fontWeight : "bold",
                fontSize : "14px"
            },
        },
        table: {
            style: {
              minWidth: "90vw",
            },
        },
    }

    return(
        <div className="container">
            <DataTable
                customStyles={customStyle}
                columns={columns}
                data = {filterData}
                selectableRows
                fixedHeader
                pagination
                selectableRowsHighlight
                highlightOnHover
                actions={<img src={delBig} className="del-btn" onClick={()=>handleDelete(selectedData)} alt="del"/>}
                subHeader
                subHeaderComponent={<input value={search} className="search" typt="text" placeholder='Search Name' onChange={(e)=> setSearch(e.target.value)} />}
                onSelectedRowsChange={handleRowChange}
            ></DataTable>
        </div>
    )
}

export default Table 