const WhichListSchema = new mongoose.Schema(
    {
        UserId:{type:String},
        ProductId:{type:String}
    })
    
WhichList=mongoose.model("WhichList", WhichListSchema);
module.exports = WhichList;
