'use strict';
var is=(element,type)=>{
	while(element){
		if(element.type==type){
			return true;
		}
		element=element.type;
	}
	return false;
};
var Expression=class extends Array{};
var Pattern=Expression;
var Alternation=class extends Array{};
var CharacterClass=class extends Array{};
var Range=class extends Array{};
var Pointer=class{
	constructor(name){
		this.name=name;
	}
};

var _compile=(source,lastIndex=0,end)=>{
	// provide basic compilation of patterns
	var patterns;
	var pattern=new Pattern;
	let i=lastIndex;
	for(let len=source.length;i<len;i++){
		let character=source[i];
		let result;
		if(character=='('){
			let group,type;
			if(source[i+1]=='!'){
				i+=2;
				type=-1;
			}else{
				i++;
			}
			group=_compile(source,i,')');
			group.type=type;
			i=group.lastIndex;
			pattern.push(group);
		}else if(character==end){
			// may be an indication of a group (lastIndex==null)
			break;
		}else if(character=='['){
			// need revised
			let characterClass=new CharacterClass;
			for(let next=source[++i];next&&next!=']';){
				let element=next=='\\'?source[++i]:next;
				next=source[++i];
				if(next=='-'){
					element=new Range(element.charCodeAt(),source[i+1].charCodeAt());
					next=source[i+=2];
				}
				characterClass.push(element);
			}
			pattern.push(characterClass);
		}else if(character=='{'){
			pattern.push(new Pointer(source.slice(i+1,i=source.indexOf('}',i))));
		}else if(character=='\\'){
			pattern.push(source[++i]);
		}else if(character=='|'){
			if(!patterns){
				patterns=new Alternation;
			}
			patterns.push(pattern);
			pattern=new Pattern;
		}else if(character=='+'){
			pattern[pattern.length-1].quantifier='+';
		}else{
			pattern.push(character);
		}
	}
	if(patterns){
		patterns.push(pattern);
		pattern=patterns;
	}
	if(end){
		pattern.lastIndex=i;
	}
	return pattern;
};
var _exec=(string,pattern,lastIndex=0)=>{
	let index=lastIndex;
	if(pattern.quantifier=='+'){
		
	}
	if(pattern instanceof Expression){
		for(let element of pattern){
			if(typeof element=='string'){
				if(string[lastIndex]==element){
					lastIndex++;
				}else{
					return null;
				}
			}else{
				let result=_exec(string,element,lastIndex);
				if(result){
					lastIndex+=result.length;
				}else{
					return null;
				}
			}
		}
	}else if(pattern instanceof CharacterClass){
		for(let element of pattern){
			if(element instanceof Range){
				let charCode=string[lastIndex].charCodeAt();
				if(charCode>=element[0]&&charCode<=element[1]){
					lastIndex++;
				}else{
					return null;
				}
			}else{
				if(string[lastIndex]==element){
					lastIndex++;
				}else{
					return null;
				}
			}
		}
	}else if(pattern instanceof Alternation){
		
	}
	return string.slice(index,lastIndex);
};

console.log(_exec('l9t a=9.0;',_compile('[a-z][a-z][a-z] [a-z]=')));
console.dir(_compile('b(!as|(!d55)+|{aa}|e)\\(a|\\)[oic-9i\\]-9a]a'),{depth:null});

var compile=(source,lastIndex=0,end)=>{
	var result=new Expression;
	var results;
	for(let i=lastIndex,len=source.length;i<len;){
		let character=source[i++];
		let element;
		if(character=='\\'){
			//Escaping (top priority)
			element=source[i++];
			result.push(element);
		}else if(character=='['){
			//Character Class
			let characterClass=new CharacterClass;
			for(;i<len;){
				let character=source[i++];
				if(character=='-'){
					characterClass[characterClass.length-1]=new Range(source[i-2].charCodeAt(),source[i++].charCodeAt());
				}else{
					if(character==']'){
						break;
					}
					characterClass[characterClass.length]=character;
				}
			}
			result.push(characterClass);
		}else if(character=='('){
			//Grouping - delimiter[0]
			[element,i]=compile(source,i,')');
			result.push(element);
		}else if(character=='|'){
			//Grouping
			element=character;
			if(!results){
				results=new Alternation(result);
			}
			result=new Expression;
			results.push(result);
		}else if(character==end){
			//Grouping - delimiter[1]
			return [results||result,i];
		}else if(character=='{'){
			//Expression
			element=new Pointer(source.slice(i,source.indexOf('}',i)));
			result.push(element);
			i=source.indexOf('}',i)+1;
		}else{
			//Normal Character
			element=character;
			result.push(element);
		}
	}
	return results||result;
};
var exec=(source,expression,lastIndex=0)=>{
	var result='';
	if(expression instanceof Alternation){
		return exec(source,new Expression(expression),lastIndex);
	}
	for(let element of expression){
		if(element instanceof Alternation){
			let isIncluded=false;
			let _result;
			for(let item of element){
				_result=exec(source,item,lastIndex);
				if(_result){
					result+=_result;
					isIncluded=true;
					break;
				}
			}
			if(!isIncluded){
				return false;
			}
		}else if(element instanceof CharacterClass){
			let isIncluded=false;
			for(let item of element){
				if(source[lastIndex]==item){
					result+=item;
					isIncluded=true;
					break;
				}
			}
			if(!isIncluded){
				return false;
			}
		}else if(element instanceof Expression){
			let _result=exec(source,element,lastIndex);
			if(_result){
				result+=_result;
			}else{
				return false;
			}
		}else if(element instanceof Pointer){
			let _result=exec(source,scope[element.name],lastIndex);
			//console.log(_result)
			if(_result){
				result+=_result;
			}else{
				return false;
			}
		}else{
			let search=element+'';
			//console.log('a'+source.slice(lastIndex,lastIndex+search.length)+'a')
			//console.log(search)
			if(source.slice(lastIndex,lastIndex+search.length)==search){
				result+=search;
			}else{
				return false;
			}
		}
		lastIndex=result.length;
		//console.log(result)
	}
	return result;
};

// don't use template tag - poor compatibility with other languages
/*var syntax=(strings,...patterns)=>{
	let lastIndex=0;
	for(let string of strings){
		for(let character of string){
			
		}
	}
	console.log(strings);
	console.log(a[0][2]);
};

syntax`asd${[1,2,3]}sad`*/

var syntax=(source,patterns)=>{
	
};

const DecimalDigit='[0-9]';
const NonZeroDigit='[1-9]';

var IdentifierName=(()=>{
	return;
	var UnicodeIDStart=syntax('[A-Za-z]');
	var UnicodeIDContinue=syntax('[A-Z+a-z*0-9]');
	var IdentifierStart=syntax('{}|$|_',UnicodeIDStart);
	var IdentifierPart=syntax('{}|$|_',UnicodeIDContinue);
	return syntax('{}{}*',IdentifierStart,IdentifierPart);
})();

var scope={
	UnicodeIDStart:'[A-Za-z]',
	UnicodeIDContinue:'[A-Z+a-z*0-9]',
	IdentifierStart:'$|_|{UnicodeIDStart}',
	IdentifierPart:'$|_|{UnicodeIDContinue}',
	IdentifierParts:'{IdentifierPart}({IdentifierParts}|)',
	IdentifierName:'{IdentifierStart}{IdentifierParts}',
};
for(let key in scope){
	scope[key]=compile(scope[key]);
}

//console.dir(scope,{depth:null});

//console.log(exec('var a=6;',scope.IdentifierParts))