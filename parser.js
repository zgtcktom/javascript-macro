'use strict';
console.time('script');

var identifier=/\w+/y;
var number=/\d+/y;
var _=/\s+/y;
var unknown=/./y;
var punctuator=/=/y

var script=`array[]=5;@g[]=rr;`;

var lastIndex=0;

var exec=(regexp,string=script)=>{
	regexp.lastIndex=lastIndex;
	var result=regexp.exec(string);
	if(!result||result.index!=lastIndex){
		return null;
	}
	lastIndex+=result[0].length;
	return result[0];
};

var execDynamic=(regexp,string=script)=>{
	var result=null;
	exec(_);
	if(regexp instanceof RegExp){
		result=exec(regexp,string);
	}else{
		for(let element of regexp){
			if(result=execDynamic(element,string)){
				break;
			}
		}
	}
	return result;
};

var expression=[number,identifier];
var token=[expression,punctuator];

var macros=[];
macros.push(['[[expression]][]=[[expression]]','$0.push($1)']);
macros.push(['@[[expression]]','($0ha)']);

var variable=/\[\[(\w+)\]\]/y;

var parse=(macro)=>{
	let initial=lastIndex;
	let _lastIndex=0;
	let $=[];
	while(macro[0][_lastIndex]){
		variable.lastIndex=_lastIndex;
		let result=variable.exec(macro[0]);
		if(result){
			_lastIndex+=result[0].length;
			let s=execDynamic(eval(result[1]));
			$.push(s);
			//console.log('55:'+script.slice(lastIndex),s,'asd')
		}else{
			if(script[lastIndex]!=macro[0][_lastIndex]){
				//console.log(59+script[lastIndex],macro[0][_lastIndex])
				return null;
			}else{
				//console.log(60+script[lastIndex],macro[0][_lastIndex])
				lastIndex++;
				_lastIndex++;
			}
		}
	}
	let replaced=macro[1].replace(/\$(\d)/g,(_,$0)=>$[$0]);
	script=script.slice(0,initial)+replaced+script.slice(lastIndex);
	lastIndex=initial;
	//console.log(`70: ${script.slice(lastIndex)}`)
	return true;
};

while(parse(macros[0])||parse(macros[1])||exec(unknown)){
	``;
}
//console.log(script);

var expr=['(/expr/)']

var parseEx=(data,pattern)=>{
	var {input,lastIndex}=data;
	var result;
	if(typeof pattern=='string'){
		
	}else if(pattern instanceof RegExp){
		pattern.lastIndex=lastIndex;
		if(result=pattern.exec(input)){
			result=result[0];
			data.lastIndex+=result.length;
		}
	}else if(Array.isArray(pattern)){
		
	}else{
		
	}
	return result;
};

var data={input:'array5[]=6;',lastIndex:0};
//console.log(parseEx(data,identifier));
//console.log(data);
(()=>{
var not=(pattern,except)=>{
	return {pattern,except,type:'not'};
};
var and=(pattern,pattern2)=>{
	return {0:pattern,1:pattern2,type:'and'};
};
var opt=(pattern)=>{
	return {0:pattern,type:'opt'};
};
var seq=(...patterns)=>{
	var seq;
	for(var pattern of patterns){
		if(seq){
			seq=and(seq,pattern);
		}else{
			seq=pattern;
		}
	}
	return seq;
};
var syntax=(source)=>{
	
};
var SourceCharacter=Symbol();
var LineTerminator=[...'\u000a\u000d\u2028\u2029'];
var WhiteSpace=/\s/y;
var IdentifierName=/(\$|\w)+/y;
var Punctuator='{ ( ) [ ] . ... ; , < > <= >= == != === !== + - * % ++ -- << >> >>> & | ^ ! ~ && || ? : = += -= *= %= <<= >>= >>>= &= |= ^= => ** **='.split(' ');
var DivPunctuator=['/=','/'];
var RightBracePunctuator='}';
var NumericLiteral=/\d+/y;
var StringLiteral=[/"[^"]*"/y,/'[^']*'/y];
var Template=/`[^`]*`/y;
var CommonToken=[IdentifierName,Punctuator,NumericLiteral,StringLiteral,Template];
var elements=[identifier,number,_,punctuator];
var RegularExpressionLiteral=(()=>{
	var RegularExpressionNonTerminator=not(SourceCharacter,LineTerminator);
	var RegularExpressionBackslashSequence=seq('\\',RegularExpressionNonTerminator);
	var RegularExpressionFlags=[IdentifierName,''];
	var RegularExpressionClassChar=[not(RegularExpressionNonTerminator,[']','\\']),RegularExpressionBackslashSequence];
	var RegularExpressionClassChars=[null,''];
	RegularExpressionClassChars[0]=seq(RegularExpressionClassChar,RegularExpressionClassChars);
	var RegularExpressionClass=seq('[',RegularExpressionClassChars,']');
	var RegularExpressionChar=[not(RegularExpressionNonTerminator,['\\','/','[']),RegularExpressionBackslashSequence,RegularExpressionClass];
	var RegularExpressionChars=[null,''];
	RegularExpressionChars[0]=and(RegularExpressionChar,RegularExpressionChars);
	var RegularExpressionFirstChar=[not(RegularExpressionNonTerminator,['*','\\','/','[']),RegularExpressionBackslashSequence,RegularExpressionClass];
	var RegularExpressionBody=and(RegularExpressionFirstChar,RegularExpressionChars);
	return seq('/',RegularExpressionBody,'/',RegularExpressionFlags);
})();
//console.dir(RegularExpressionLiteral,{depth:null});

var temp=(()=>{
	return;
	return [DecimalLiteral,BinaryIntegerLiteral,OctalIntegerLiteral,HexIntegerLiteral];
})();

var Comment=(()=>{
	var SingleLineCommentChar=not(SourceCharacter,LineTerminator);
	var SingleLineCommentChars=[];
	// optimize
	SingleLineCommentChars[0]=and(SingleLineCommentChar,opt(SingleLineCommentChars));
	var SingleLineComment=and('//',opt(SingleLineCommentChars));
	return [SingleLineComment];
})();

var InputElementDiv=[WhiteSpace,LineTerminator
,Comment
,CommonToken
,DivPunctuator
,RightBracePunctuator];

var InputElementRegExp=[WhiteSpace,
LineTerminator,
Comment,
CommonToken,
RightBracePunctuator,
RegularExpressionLiteral];

class Walker{
	constructor(source){
		this.source=source;
		this.lastIndex=0;
	}
	next(){
		
	}
}

var parseAny=(input,lastIndex,pattern)=>{
	//console.log(lastIndex)
	if(pattern instanceof RegExp){
		return parseRegExp(input,lastIndex,pattern);
	}else if(Array.isArray(pattern)){
		return parseArray(input,lastIndex,pattern);
	}else if(typeof pattern=='string'){
		//console.log(lastIndex,pattern.length)
		var result=input.substr(lastIndex,pattern.length);
		return result==pattern?result:null;
	}else if(pattern==SourceCharacter){
		return input[lastIndex];
	}else if(pattern.type=='opt'){
		return parseAny(input,lastIndex,pattern[0])||'';
	}else if(pattern.type=='not'){
		var result=parseAny(input,lastIndex,pattern.pattern);
		return result!=parseAny(input,lastIndex,pattern.except)?result:null;
	}else if(pattern.type=='and'){
		var result=parseAny(input,lastIndex,pattern[0]);
		if(result!=null){
			var result2=parseAny(input,lastIndex+result.length,pattern[1]);
			return result2!=null?result+result2:null;
		}
		return null;
	}else{
		return null;
	}
};
var parseRegExp=(input,lastIndex,pattern)=>{
	var result;
	pattern.lastIndex=lastIndex;
	if(result=pattern.exec(input)){
		result=result[0];
	}
	return result;
};
var parseArray=(input,lastIndex,patterns)=>{
	var result;
	for(var pattern of patterns){
		result=parseAny(input,lastIndex,pattern);
		if(result!=null){
			return result;
		}
	}
	return null;
};

function* parser(input,pattern=InputElementRegExp){
	var totalWhiteSpace=0;
	var lastIndex=0;
	while(lastIndex<input.length){
		let result=parseAny(input,lastIndex,pattern);
		if(result!=null){
			lastIndex+=result.length;
			if(result!=' '){
				yield result;
			}else{
				totalWhiteSpace++;
			}
		}else{
			yield false;
			break;
		}
	}
	yield totalWhiteSpace;
}


//console.dir([...parser(`var a=6;`)]);
//console.log('start');
//console.time('fileread');
//console.dir([...parser(require('fs').readFileSync(__filename, 'utf8'))].join(' '));
//console.timeEnd('fileread');
//console.dir([...parser(`/asd/y`)]);
//console.dir([...parser(`/asd/y`,RegularExpressionLiteral)]);
lastIndex/=8/9;

//console.log(__filename);

var isString=x=>typeof x=='string';
var isRegExp=x=>x instanceof RegExp;

var ALT=1;
var NOT=2;
var OPT=3;
var REP=4;

var create=(pattern,type)=>{
	pattern.type=type;
	return pattern;
};
var alt=(...pattern)=>create(pattern,ALT);
var not=(...pattern)=>create(pattern,NOT);
var opt=(...pattern)=>create(pattern,OPT);
var rep=(...pattern)=>create(pattern,REP);

var parseString=(source,lastIndex,pattern)=>{
	var result=source.substr(lastIndex,pattern.length);
	return result==pattern?result:null;
};
var parseRegExp=(source,lastIndex,pattern)=>{
	pattern.lastIndex=lastIndex;
	var result=pattern.exec(source);
	return result?result[0]:null;
};

var tokens=[
	IdentifierName,
	NumericLiteral,
	StringLiteral,
	RegularExpressionLiteral,
	Template,
	Punctuator,
	DivPunctuator,
	RightBracePunctuator,
];
var lastToken;
var parse=(()=>{
	var parse=(source,lastIndex,pattern)=>{
		if(pattern==SourceCharacter){
			return source[lastIndex];
		}else if(isString(pattern)){
			return parseString(source,lastIndex,pattern);
		}else if(typeof pattern=='number'){
			return parse(source,lastIndex,pattern+'');
		}else if(isRegExp(pattern)){
			return parseRegExp(source,lastIndex,pattern);
		}else{
			var type=pattern.type;
			if(type==ALT){
				for(let item of pattern){
					var result=parse(source,lastIndex,item);
					if(result!=null){
						return result;
					}
				}
				return null;
			}else if(type==NOT){
				return parse(source,lastIndex,pattern[1])==null?parse(source,lastIndex,pattern[0]):null;
			}else if(type==OPT){
				return parse(source,lastIndex,pattern[0])||'';
			}else if(type==REP){
				var result='';
				while(1){
					var _result=parse(source,lastIndex,pattern[0]);
					if(_result==null){
						break;
					}else{
						result+=_result;
						lastIndex+=_result.length;
					}
				}
				return result?result:null;
			}else{
				var result='';
				for(let item of pattern){
					var _result=parse(source,lastIndex,item);
					if(_result==null){
						return null;
					}else{
						result+=_result;
						lastIndex+=_result.length;
					}
				}
				return result;
			}
		}
	};
	return (source,lastIndex,pattern)=>{
		var result=parse(source,lastIndex,pattern);
		if(result!=null&&tokens.includes(pattern)){
			lastToken=pattern;
		}
		return result;
	};
})();

var SourceCharacter=Symbol();
var LineTerminator=alt(...'\u000a\u000d\u2028\u2029');
var LineTerminatorSequence=alt('\u000d\u000a',...'\u000a\u000d\u2028\u2029');

var IdentifierName=/[A-z$_](?:\w|[$_])*/y;
var Punctuator='{ ( ) [ ] . ... ; , < > <= >= == != === !== + - * % ++ -- << >> >>> & | ^ ! ~ && || ? : = += -= *= %= <<= >>= >>>= &= |= ^= => ** **='.split(' ').sort((a,b)=>b.length-a.length);
var DivPunctuator=['/=','/'];
var RightBracePunctuator='}';

// NumericLiteral
var NonZeroDigit=alt(1,2,3,4,5,6,7,8,9);
var DecimalDigit=alt(0,1,2,3,4,5,6,7,8,9);
var DecimalDigits=rep(DecimalDigit);
var DecimalIntegerLiteral=alt(0,[NonZeroDigit,opt(DecimalDigits)]);
var ExponentIndicator=alt('e','E');
var SignedInteger=alt(['+',DecimalDigits],['-',DecimalDigits],DecimalDigits);
var ExponentPart=[ExponentIndicator,SignedInteger];
var DecimalLiteral=alt(
	[DecimalIntegerLiteral,'.',opt(DecimalDigits),opt(ExponentPart)],
	['.',DecimalDigits,opt(ExponentPart)],
	[DecimalIntegerLiteral,opt(ExponentPart)]
);
var BinaryDigit=alt(0,1);
var BinaryDigits=rep(BinaryDigit);
var BinaryIntegerLiteral=alt(['0b',BinaryDigits],['0B',BinaryDigits]);
var OctalDigit=alt(0,1,2,3,4,5,6,7);
var OctalDigits=rep(OctalDigit);
var OctalIntegerLiteral=alt(['0o',OctalDigits],['0O',OctalDigits]);
var HexDigit=alt(...'0123456789abcdefABCDEF');
var HexDigits=rep(HexDigit);
var HexIntegerLiteral=alt(['0o',HexDigits],['0O',HexDigits]);
var NumericLiteral=alt(DecimalLiteral,BinaryIntegerLiteral,OctalIntegerLiteral,HexIntegerLiteral);

// StringLiteral
var StringLiteral=(()=>{
	var HexDigit=alt(...'0123456789abcdefABCDEF');
	var Hex4Digits=[HexDigit,HexDigit,HexDigit,HexDigit];
	var UnicodeEscapeSequence=alt(['u',Hex4Digits],['u{',Hex4Digits,'}']);
	var HexEscapeSequence=['x',HexDigit,HexDigit];
	var SingleEscapeCharacter=alt(...`'"\\bfnrtv`);
	var EscapeCharacter=alt(SingleEscapeCharacter,DecimalDigit,'x','u');
	var NonEscapeCharacter=not(SourceCharacter,alt(EscapeCharacter,LineTerminator));
	var CharacterEscapeSequence=alt(SingleEscapeCharacter,NonEscapeCharacter);
	var EscapeSequence=alt(CharacterEscapeSequence,/0(?![0-9])/y,HexEscapeSequence,UnicodeEscapeSequence);
	var LineContinuation=['\\',LineTerminatorSequence];
	//console.log(CharacterEscapeSequence)
	//console.dir('\0a2');
	return;
	var StringLiteral=alt(['"',opt(DoubleStringCharacters),'"'],['\'',opt(SingleStringCharacters),'\'']);
	return StringLiteral;
})();

var ALTERNATION=Symbol();
var ALTERNATION=Symbol();
var REPETITION=Symbol();

var either=(...patterns)=>{
	return {patterns,type:ALTERNATION};
};
var either=(...patterns)=>{
	return {patterns,type:ALTERNATION};
};

var HexDigit=alt(...'0123456789abcdefABCDEF');

var parseARE=(string,lastIndex=0,result=[])=>{
	while(lastIndex<string.length){
		var char=string[lastIndex++];
		if(char=='.'){
			result.push('.');
		}else if(char=='\\'){
			char=string[lastIndex++];
			if(char=='u'){
				result.push('\\u'+string.slice(lastIndex,lastIndex+=4));
			}else{
				result.push('\\'+char);
			}
		}else if(char=='('){
			if(string[lastIndex]=='?'){
				if(string[lastIndex+1]=='='){
					var _result=parseARE(string,lastIndex+2);
					result.push(['?=',_result]);
					lastIndex=_result.lastIndex;
				}else if(string[lastIndex+1]=='!'){
					var _result=parseARE(string,lastIndex+2);
					result.push(['?!',_result]);
					lastIndex=_result.lastIndex;
				}
			}else{
				var _result=parseARE(string,lastIndex);
				result.push(_result);
				lastIndex=_result.lastIndex;
			}
			lastIndex++;
		}else if(char=='@'){
			var pattern=/\w+/y;
			pattern.lastIndex=lastIndex;
			result.push('@'+pattern.exec(string)[0]);
			lastIndex=pattern.lastIndex;
		}else if(char==')'){
			lastIndex--;
			break;
		}else if(char=='|'){
			var _result=parseARE(string,lastIndex);
			result=[result,_result];
			lastIndex=_result.lastIndex;
		}else{
			result.push(char);
		}
	}
	result.lastIndex=lastIndex;
	return result;
};

console.dir(parseARE(/(?!abc)@ff+a\w(a|b)c/.source),{depth:null});

//console.dir(NumericLiteral);
console.log(parse(`7.2e-966s`,0,NumericLiteral));
//console.log(parse(`'"sadsad'`,0,StringLiteral));
console.log(parse(`var a=6;`,0,IdentifierName));

})();


console.timeEnd('script');