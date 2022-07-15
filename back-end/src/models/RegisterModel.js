const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:true},
  birthDate:{type:String,required:true},
  address:{type:String,required:true,minLength:5,maxLength:400},
});

const RegisterModel = mongoose.model('Register', RegisterSchema);

class Register {
      constructor(reqbody){
          this.reqbody=reqbody;
          this.errors=[];
          this.user=null;
      }
      async register(){
        this.cleanData();
        this.validate();
        if(this.errors.length>0)return;

        await this.userExists()

        if(this.errors.length>0)return;
        this.user=await RegisterModel.create(this.reqbody);
        return;
      }
      async userExists(){
        this.user=await RegisterModel.findOne({email:this.reqbody.email});
        if(this.user)return this.errors.push("Email já cadastrado.");
        this.user=await RegisterModel.findOne({name:this.reqbody.name});
        if(this.user)return this.errors.push("Nome do paciente já cadastrado.");
        return;
      }
      cleanData(){
        for(let key in this.reqbody){
            if(typeof this.reqbody[key] !== "string")this.reqbody[key]="";
        }
        return;
      }
      validate(){
        //Verific Name
        if(!this.reqbody.name || this.reqbody.name==="")this.errors.push("Nome do paciente inválido");
        if(this.reqbody.name && this.reqbody.name.split("").indexOf(" ")===-1)this.errors.push("Digite seu nome e sobrenome para continuar.");
        //Verific E-mail
        const emailRegex=/\S+@\S+\.\S+/;
        if(!this.reqbody.email || this.reqbody.email==="")this.errors.push("E-mail é um campo obrigatório.");
        if(!emailRegex.test(this.reqbody.email))this.errors.push("E-mail inválido.");
        //Verific Date Birth
        const birthRegex=/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
        if(!this.reqbody.birthDate || this.reqbody.birthDate==="")this.errors.push("Data de Nascimento é um campo obrigatório.");
        if(!birthRegex.test(this.reqbody.birthDate))this.errors.push("Data de nascimento inválida. Favor digitar no formato dd/mm/aaaa.");
        //Verific Address
        if(!this.reqbody.address || this.reqbody.address==="")this.errors.push("Endereço é um campo requerido.");
        return;
      }
}
module.exports.RegisterModel=RegisterModel;
module.exports.Register = Register;
