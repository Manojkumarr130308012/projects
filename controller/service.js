const serviceSchema = require('../model/service');
const errorHandler = require('../utils/error.handler');

class ServiceController {
    async add(farm){
		try{
			let response = await serviceSchema.create(farm);
			return { status: "success",   msg:"Service Added successfully", result: response };
		} catch(error){
			return {
				status: "error",
				error: errorHandler.parseMongoError(error)
			};
		}
	}
	
	async fetch(){
		try{

            
			let response = await serviceSchema.find({});
			let count=Object.keys(response).length;
			return {
				response: response,
				count:count
			};
		} catch(error){
			return {
				status: "error",
				error: errorHandler.parseMongoError(error)
			};
		}
	}
  

	async fetchdata(id){
		try{
			let response = await serviceSchema.find({_id:id});
			return response;	
		} catch(error){
			return {
				status: "error",
				error: errorHandler.parseMongoError(error)
			};
		}
	}

	async delete(id){
		try{
			let response = await serviceSchema.deleteOne({_id: id});
			return {
				status: "success",
				response: response
			};
		} catch(error){
			return {
				status: "error",
				error: errorHandler.parseMongoError(error)
			};
		}
	}

	async update(id, body) {

        try {
            let response = await serviceSchema.update({_id: id}, body);
            return { status: "success", msg:"Service Updated successfully",result: response };

        } catch (error) {
            return { status: "error", error: error };
        }

    }
	
}

       

module.exports=new ServiceController();