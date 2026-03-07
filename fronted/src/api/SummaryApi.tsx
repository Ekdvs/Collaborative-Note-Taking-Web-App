
export const baseUrl = "http://localhost:8080" //import.meta.env.BASE_URL || "http://localhost:8080";


const SummaryApi = {

    //register
    register:{
        url:"/api/users/register",
        method:"POST"
    },
    login:{
        url:"/api/users/login",
        method:"POST"
    }
}

export default SummaryApi;