import axios from "@/api/axios";


const exportApi  = async () => {
    return axios.get("/export/customers", {
        responseType: "blob", 
        withCredentials: true,
    });

};

const searchApi = async ({id, fullName}) => {
    const listRequest = {
        id : id,
        fullName: fullName,
    }

    return axios.get("/customers/list-customers", {...listRequest});
};

export {exportApi, searchApi};