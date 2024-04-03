
const Types = (Mongoose:any)=>{
    return new Mongoose.Schema(
        {
            title:{
                type:String,
                required: [true, "Types Title missing"]
            },
            desc: {
                type:String

            }
        },
        {
            timestamps: true,
          }
    )
}

export default Types;