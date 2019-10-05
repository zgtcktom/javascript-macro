'use strict';
/*
Expression:[
	Alternation:[
		Expression:['v','a','r'],
		Expression:['l','e','t']
	]
]
*/
var Expression=class extends Array{};
var CharacterClass=class extends Expression{};
var Alternation=class extends Expression{};

var compile=(source,lastIndex=0)=>{
	
};

var exec=(string,pattern,index=0,ignore=false)=>{
	let lastIndex=index;
	let result;
	if(!ignore&&pattern.quantifier){
		let [n,m]=pattern.quantifier;
		let count=0;
		while(m==-1||count<=m){
			let result=exec(string,pattern,lastIndex,true);
			if(result==null){
				break;
			}
			count++;
			lastIndex+=result.length;
		}
		if(count<n){
			return null;
		}
		result=string.slice(index,lastIndex);
	}else if(pattern instanceof CharacterClass){
		if(!pattern.includes(string[lastIndex])){
			return null;
		}
		result=string[lastIndex];
	}else if(pattern instanceof Alternation){
		pattern.find(pattern=>{
			result=exec(string,pattern,lastIndex);
			return result!=null;
		});
		if(typeof result!='string'){
			return null;
		}
	}else if(pattern instanceof Expression){
		for(let element of pattern){
			result=exec(string,element,lastIndex);
			if(result==null){
				return null;
			}
			lastIndex+=result.length;
		}
		result=string.slice(index,lastIndex);
	}else{
		if(string[lastIndex]!=pattern){
			return null;
		}
		result=pattern;
	}
	return result;
};

console.log([1,1][1]);

console.log(exec('var 9',new Expression(Object.assign(new CharacterClass(...('varlet'.split(''))),{quantifier:[0,-1]}),' ','9')))