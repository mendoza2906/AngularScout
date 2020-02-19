import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ValidadorService {

  constructor() { }

  validaCedula(cedula: string) {
 
    // Preguntamos si la cedula consta de 10 digitos
    if (cedula.length === 10) {
     
      // Obtenemos el digito de la region que sonlos dos primeros digitos
      const digitoRegion = parseInt(cedula.substring(0, 2));
      
      // Pregunto si la region existe ecuador se divide en 24 regiones
      if (digitoRegion >= parseInt(String(1)) && digitoRegion <= parseInt(String(24))) {
       
        // Extraigo el ultimo digito
        const ultimoDigito = Number(cedula.substring(9, 10));
       
        // Agrupo todos los pares y los sumo
        const pares = Number(cedula.substring(1, 2)) + Number(cedula.substring(3, 4)) + Number(cedula.substring(5, 6)) + Number(cedula.substring(7, 8));
        
        // Agrupo los impares, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
        let numeroUno: any = cedula.substring(0, 1);
        numeroUno = (numeroUno * 2);
        if (numeroUno > 9) {
          numeroUno = (numeroUno - 9);
        }
  
        let numeroTres: any = cedula.substring(2, 3);
        numeroTres = (numeroTres * 2);
        if (numeroTres > 9) {
          numeroTres = (numeroTres - 9);
        }
  
        let numeroCinco: any = cedula.substring(4, 5);
        numeroCinco = (numeroCinco * 2);
        if (numeroCinco > 9) {
          numeroCinco = (numeroCinco - 9);
        }
  
        let numeroSiete: any = cedula.substring(6, 7);
        numeroSiete = (numeroSiete * 2);
        if (numeroSiete > 9) {
          numeroSiete = (numeroSiete - 9);
        }
  
        let numeroNueve: any = cedula.substring(8, 9);
        numeroNueve = (numeroNueve * 2);
        if (numeroNueve > 9) {
          numeroNueve = (numeroNueve - 9);
        }
  
        const impares = numeroUno + numeroTres + numeroCinco + numeroSiete + numeroNueve;
  
        // Suma total
        const sumaTotal = (pares + impares);
  
        // extraemos el primero digito
        const primerDigitoSuma = String(sumaTotal).substring(0, 1);
  
        // Obtenemos la decena inmediata
        const decena = (Number(primerDigitoSuma) + 1) * 10;
  
        // Obtenemos la resta de la decena inmediata - la suma_total esto nos da el digito validador
        let digitoValidador = decena - sumaTotal;
  
        // Si el digito validador es = a 10 toma el valor de 0
        if (digitoValidador === 10) {
          digitoValidador = 0;
        }
  
        // Validamos que el digito validador sea igual al de la cedula
        if (digitoValidador === ultimoDigito) {
          return true;
        } else {
          return false;
        }
  
      } else {
        // imprimimos en consola si la region no pertenece
        return false;
      }
    } else {
      // Imprimimos en consola si la cedula tiene mas o menos de 10 digitos
      return false;
    }
  
  }
  
  validaFechaNacimiento(fecha){
    //valida edad entre 16 y 70 años
    let fecha_actual= new Date();
    let yearTo= fecha_actual.getFullYear()-16;
    let yearFrom=fecha_actual.getFullYear()-70;
    let date = fecha;
    let result = date.getFullYear() >= yearFrom && date.getFullYear() <= yearTo;
    return result;
  }

  validaMails(mail){
    var test = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	  var emailReg = new RegExp(test);
	  return emailReg.test(mail);
  }

  validaNombres(nombres){
    var test =  /^([a-z ñáéíóú]{3,100})$/i;
    var nomReg = new RegExp(test);
    return nomReg.test(nombres);
     //return false
  }

  validaApellidos(apellidos){
    var test =  /^([a-z ñáéíóú]{3,100})$/i;
    var apelReg = new RegExp(test);
    return apelReg.test(apellidos);
    //return false
  }
  
  //valida telefono
  validaTelefono(tel) {
    var test = /^[0-9]{2,3}-? ?[0-9]{6,7}$/;
    var telReg = new RegExp(test);
    return telReg.test(tel);
  };
  //valida celular
  validaCelular(tel) {
      var test = /^[0-9]{2,3}-? ?[0-9]{6,7}$/;
      var telReg = new RegExp(test);
      return telReg.test(tel);
  };
  
  //valida DNI
  validaDNI(value){

	  var validChars = 'TRWAGMYFPDXBNJZSQVHLCKET';
	  var nifRexp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
	  var nieRexp = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
	  var str = value.toString().toUpperCase();

	  if (!nifRexp.test(str) && !nieRexp.test(str)) return false;

	  var nie = str
	      .replace(/^[X]/, '0')
	      .replace(/^[Y]/, '1')
	      .replace(/^[Z]/, '2');

	  var letter = str.substr(-1);
	  var charIndex = parseInt(nie.substr(0, 8)) % 23;

	  if (validChars.charAt(charIndex) === letter) return true;

	  return false;
};

//Valida pasaporte español
validaPasaporte(value: string) {
	    return /^[a-z]{3}[0-9]{6}[a-z]?$/i.test(value);
}
//Valida Usuario
validaUsuario(user: string) {
	//var q= "123123asdasdasd-/";
	//var r = /^[A-z0-9\/\-]+$/g;
	//var test = /^[a-z]{3}[0-9]{6}[a-z]?$/;
	var test = /^[A-z0-9\/\-]+$/g;
	var userReg = new RegExp(test);
	return userReg.test(user);
}   

//Valida clave
validaClave(clave:string){
	
	var re = /^[a-z\d]{10,15}$/i;
	var nre = /^([A-Z]{10,15}|[a-z]{10,15}|\d{10,15}|[A-Z\d]{10,15}|[A-Za-z]{10,15}|[a-z\d]{10,15})$/;
	return (re.test(clave) && !nre.test(clave));
		
}

//Valida dirección
validaDireccion (direccion)	{
		    //var reg = /^([a-z ñáéíóú]{2,60})$/i;
		    //if(reg.test(valor)) return true;
		    //else return false;
		    var test =  /^([a-z-z0-9 ñáéíóú.,]{3,200})$/i;
						var nomReg = new RegExp(test);
						return nomReg.test(direccion);
		    
		};

    validaDescripciom (descripcion)	{
      var test =  /^([a-z-z0-9 ñáéíóú.,]{3,200})$/i;
          var nomDesc = new RegExp(test);
          return nomDesc.test(descripcion);
      
    };
    
    validaUrl (url)	{
     // var test = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      var test = /^([a-zA-Z0-9_])+\/(([a-zA-Z0-9\-])+)+([a-zA-Z0-9]{2,4})+$/;
          var nomUrl = new RegExp(test);
          return nomUrl.test(url);
      
    };
    
    /**
  *Método que me permite validar y comparar dos fechas
  * 
  * @param fechaI parametro tipo Date que indica la fecha inicial 
  * 
  * @param fechaF parametro tipo Date que indica la fecha final
  * 
  * @param igual  parametro opcional que  indica que evaluará la igualdad de éstas dos fechas
  * ### Ejemplo de uso 1
  * Devolvera un `true` en caso de que la fecha final sea menor que la fecha inicial
  * ```
  * validarFechas(Fecha inicial,Fecha final)
  * ```
  * 
  * ### Ejemplo de uso 2
  * En este ejemplo se valida la igualdad y devuelve un `true` en caso de que ambas fechas sean iguales
  * ```
  * validarFechas(Fecha inicial,Fecha final,true)
  * ```
  */
 validarFechas(fechaI: Date,fechaF: Date, igual?:boolean)
 {
   fechaI.setHours(0,0,0,0);//establecemos las h,min,seg,mil a cero
   fechaF.setHours(0,0,0,0);//establecemos las h,min,seg,mil a cero
   
   if(igual){
     if(fechaF.getTime() == fechaI.getTime()){
       return true;
     }
   }else if(fechaF.getTime() < fechaI.getTime()){
     return true;
   }
   return false;
 }

 /**
  * Valida que no se ingresen caracteres no establecidos en el test de este método
  * 
  * @param text 
  */
 validarcaracterEspecial(text){
   var test = /^([A-Za-z ñáéíóú":.,'´\-]{3,100})$/i;
   var nomText = new RegExp(test);
   return nomText.test(text);
 }
}
