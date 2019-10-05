'use strict';
let compile=(source,index=0,parent)=>{
	let pattern=[];
	let chr;
	while(chr=source[index++]){
		if(chr==')'){
			if(!parent){
				throw 'Unexpected delimiter';
			}
			parent.push(pattern);
			return index;
		}
		if(chr=='('){
			index=compile(source,index,pattern);
		}else{
			pattern.push(chr);
		}
	}
	if(parent){
		throw 'Unexpected delimiter';
	}
	return pattern;
};

console.log(compile('5(53(9)(10))'))