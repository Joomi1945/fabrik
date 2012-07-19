var fabrikCalendar=new Class({Implements:[Options],options:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tues","Wed","Thur","Fri","Sat"],months:["January","Feburary","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"],viewType:"month",calendarId:1,tmpl:"default",Itemid:0,colors:{bg:"#F7F7F7",highlight:"#FFFFDF",headingBg:"#C3D9FF",today:"#dddddd",headingColor:"#135CAE",entryColor:"#eeffff"},eventLists:[],listid:0,popwiny:0,urlfilters:[],url:{add:"index.php?option=com_fabrik&controller=visualization.calendar&view=visualization&task=getEvents&format=raw",del:"index.php?option=com_fabrik&controller=visualization.calendar&view=visualization&task=deleteEvent&format=raw"},monthday:{width:90,height:80},restFilterStart:"na"},initialize:function(a){this.firstRun=true;this.el=document.id(a);this.SECOND=1000;this.MINUTE=this.SECOND*60;this.HOUR=this.MINUTE*60;this.DAY=this.HOUR*24;this.WEEK=this.DAY*7;this.date=new Date();this.selectedDate=new Date();this.entries=$H();this.droppables={month:[],week:[],day:[]};this.fx={};this.ajax={};if(typeOf(this.el.getElement(".calendar-message"))!=="null"){this.fx.showMsg=new Fx.Morph(this.el.getElement(".calendar-message"),{duration:700});this.fx.showMsg.set({opacity:0})}this.colwidth=[];this.windowopts={id:"addeventwin",title:"add/edit event",loadMethod:"xhr",minimizable:false,evalScripts:true,width:380,height:320,onContentLoaded:function(b){b.fitToContent()}.bind(this)};Fabrik.addEvent("fabrik.form.submitted",function(c,b){this.ajax.updateEvents.send();Fabrik.Windows.addeventwin.close()}.bind(this))},removeFormEvents:function(a){this.entries.each(function(c,b){if(typeof(c)!=="undefined"&&c.formid===a){this.entries.dispose(b)}}.bind(this))},_makeEventRelDiv:function(k,a,e){var j;var h=k.label;a.left===a.left?a.left:0;a["margin-left"]===a["margin-left"]?a["margin-left"]:0;a.height=a.height?a.height:1;var g=(k.colour!=="")?k.colour:this.options.colors.entryColor;if(a.startMin===0){a.startMin=a.startMin+"0"}if(a.endMin===0){a.endMin=a.endMin+"0"}var l=a.view?a.view:"dayView";var b={"background-color":this._getColor(g,e),width:a.width,cursor:"pointer","margin-left":a["margin-left"],height:a.height.toInt()+"px",top:a.top.toInt()+"px",position:"absolute",border:"1px solid #666666","border-right":"0","border-left":"0",overflow:"auto",opacity:0.6};if(a.left){b.left=a.left.toInt()+1+"px"}var c="fabrikEvent_"+k._listid+"_"+k.id;if(a.view==="monthView"){b.width-=1}var f=new Element("div",{"class":"fabrikEvent",id:c,styles:b});f.addEvent("mouseenter",function(m){this.doPopupEvent(m,k,h)}.bind(this));if(k.link!==""&&this.options.readonly===false){j=new Element("a",{href:k.link,"class":"fabrikEditEvent",events:{click:function(n){n.stop();var p={};var m=n.target.getParent(".fabrikEvent").id.replace("fabrikEvent_","").split("_");p.rowid=m[1];p.listid=m[0];this.addEvForm(p)}.bind(this)}}).appendText(h)}else{j=new Element("span").appendText(h)}f.adopt(j);return f},doPopupEvent:function(h,f,b){var j;var g=this.activeHoverEvent;this.activeHoverEvent=h.target.hasClass("fabrikEvent")?h.target:h.target.getParent(".fabrikEvent");if(!f._canDelete){this.popWin.getElement(".popupDelete").hide()}else{this.popWin.getElement(".popupDelete").show()}if(!f._canEdit){this.popWin.getElement(".popupEdit").hide();this.popWin.getElement(".popupView").show()}else{this.popWin.getElement(".popupEdit").show();this.popWin.getElement(".popupView").hide()}if(this.activeHoverEvent){j=this.activeHoverEvent.getCoordinates()}else{j={top:0,left:0}}var a=this.popup.getElement("div[class=popLabel]");a.empty();a.set("text",b);this.activeDay=h.target.getParent();var c=j.top-this.popWin.getSize().y;var k={opacity:[0,1],top:[j.top+50,j.top-10]};this.inFadeOut=false;this.popWin.setStyles({left:j.left+20,top:j.top});this.fx.showEventActions.cancel().set({opacity:0}).start.delay(500,this.fx.showEventActions,k)},_getFirstDayInMonthCalendar:function(e){var b=new Date();b.setTime(e.valueOf());if(e.getDay()!==this.options.first_week_day){var c=e.getDay()-this.options.first_week_day;if(c<0){c=7+c}e.setTime(e.valueOf()-(c*24*60*60*1000))}if(b.getMonth()===e.getMonth()){var a=7*24*60*60*1000;while(e.getDate()>1){e.setTime(e.valueOf()-this.DAY)}}return e},showMonth:function(){var f=new Date();f.setTime(this.date.valueOf());f.setDate(1);f=this._getFirstDayInMonthCalendar(f);var a=this.el.getElements(".monthView tr");var h=0;for(var b=1;b<a.length;b++){var e=a[b].getElements("td");var g=0;e.each(function(k){k.setProperties({"class":""});k.addClass(f.getTime());if(f.getMonth()!==this.date.getMonth()){k.addClass("otherMonth")}if(this.selectedDate.isSameDay(f)){k.addClass("selectedDay")}k.empty();k.adopt(new Element("div",{"class":"date",styles:{"background-color":this._getColor("#E8EEF7",f)}}).appendText(f.getDate()));var c=0;this.entries.each(function(o){if((o.enddate!==""&&f.isDateBetween(o.startdate,o.enddate))||(o.enddate===""&&o.startdate.isSameDay(f))){var l=k.getElements(".fabrikEvent").length;var j=20;var q=(k.getSize().y*(b-1))+this.el.getElement(".monthView .dayHeading").getSize().y+k.getElement(".date").getSize().y;this.colwidth[".monthView"]=this.colwidth[".monthView"]?this.colwidth[".monthView"]:k.getSize().x;var m=k.getSize().x;m=this.colwidth[".monthView"];q=q+(l*j);var p=m*g;var n={width:m,height:j,view:"monthView"};n.top=q;if(window.ie){n.left=p}n.startHour=o.startdate.getHours();n.endHour=o.enddate.getHours();n.startMin=o.startdate.getMinutes();n.endMin=o.enddate.getMinutes();n["margin-left"]=0;k.adopt(this._makeEventRelDiv(o,n,f))}c++}.bind(this));f.setTime(f.getTime()+this.DAY);g++}.bind(this))}document.addEvent("mousemove",function(k){var j=k.target;var c=k.client.x;var o=k.client.y;var m=this.activeArea;if(typeOf(m)!=="null"&&typeOf(this.activeDay)!=="null"){if((c<=m.left||c>=m.right)||(o<=m.top||o>=m.bottom)){if(!this.inFadeOut){var l=this.activeHoverEvent.getCoordinates();var n={opacity:[1,0],top:[l.top-10,l.top+50]};this.fx.showEventActions.cancel().start.delay(500,this.fx.showEventActions,n)}this.activeDay=null}}}.bind(this));this.entries.each(function(j){var c=this.el.getElement(".fabrikEvent_"+j._listid+"_"+j.id);if(c){}}.bind(this));this._highLightToday();this.el.getElement(".monthDisplay").innerHTML=this.options.months[this.date.getMonth()]+" "+this.date.getFullYear()},_makePopUpWin:function(){if(typeOf(this.popup)==="null"){var c=new Element("div",{"class":"popLabel"});var a=new Element("div",{"class":"popupDelete"}).adopt(new Element("a",{href:"#",events:{mouseenter:function(){},mouseleave:function(){},click:function(f){f.stop();this.deleteEntry(f)}.bind(this)}}).adopt(new Element("img",{src:Fabrik.liveSite+"plugins/fabrik_visualization/calendar/views/calendar/tmpl/"+this.options.tmpl+"/images/del.png",alt:"del","class":"fabrikDeleteEvent"})).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_DELETE")));var b=new Element("div").adopt(new Element("a",{href:"#",events:{mouseenter:function(){},mouseleave:function(){},click:function(f){this.editEntry(f)}.bind(this)}}).adopt([new Element("span",{"class":"popupEdit"}).adopt(new Element("img",{src:Fabrik.liveSite+"plugins/fabrik_visualization/calendar/views/calendar/tmpl/"+this.options.tmpl+"/images/edit.png",alt:Joomla.JText._("PLG_VISUALIZATION_CALENDAR_EDIT"),"class":"fabrikEditEvent"})).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_EDIT")),new Element("span",{"class":"popupView"}).adopt(new Element("img",{src:Fabrik.liveSite+"media/com_fabrik/images/view.png",alt:Joomla.JText._("PLG_VISUALIZATION_CALENDAR_VIEW"),"class":"fabrikViewEvent"})).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_VIEW"))]));a.addEvent("mousewithin",function(){});this.popup=new Element("div",{"class":"popWin",styles:{position:"absolute"}}).adopt([c,a,b]);this.popup.inject(document.body);this.activeArea=null;this.fx.showEventActions=new Fx.Morph(this.popup,{duration:500,transition:Fx.Transitions.Quad.easeInOut,onCancel:function(){}.bind(this),onComplete:function(h){if(this.activeHoverEvent){var f=this.popup.getCoordinates();var k=this.activeHoverEvent.getCoordinates();var g=window.getScrollTop();var j={};j.left=(f.left<k.left)?f.left:k.left;j.top=(f.top<k.top)?f.top:k.top;j.top=j.top-g;j.right=(f.right>k.right)?f.right:k.right;j.bottom=(f.bottom>k.bottom)?f.bottom:k.bottom;j.bottom=j.bottom-g;this.activeArea=j;this.inFadeOut=false}}.bind(this)})}return this.popup},makeDragMonthEntry:function(a){},showWeek:function(){var g;var m=this.date.getDay();m=m-this.options.first_week_day.toInt();var a=new Date();a.setTime(this.date.getTime()-(m*this.DAY));var e=new Date();e.setTime(this.date.getTime()-(m*this.DAY));var c=new Date();c.setTime(this.date.getTime()+((6-m)*this.DAY));this.el.getElement(".monthDisplay").innerHTML=(a.getDate())+"  "+this.options.months[a.getMonth()]+" "+a.getFullYear()+" - ";this.el.getElement(".monthDisplay").innerHTML+=(c.getDate())+"  "+this.options.months[c.getMonth()]+" "+c.getFullYear();var l=this.el.getElements(".weekView tr");var b=l[0].getElements("th");for(var k=1;k<l.length;k++){a.setHours(k-1,0,0);if(k!==1){a.setTime(a.getTime()-(6*this.DAY))}var h=l[k].getElements("td");for(g=1;g<h.length;g++){if(g!==1){a.setTime(a.getTime()+this.DAY)}var f=h[g];f.empty();f.className="";f.addClass("day");f.addClass(a.getTime()-this.HOUR);if(this.selectedDate.isSameWeek(a)&&this.selectedDate.isSameDay(a)){f.addClass("selectedDay")}else{f.removeClass("selectedDay")}}}e=new Date();e.setTime(this.date.getTime()-(m*this.DAY));for(k=0;k<b.length;k++){b[k].className="dayHeading";b[k].addClass(e.getTime());b[k].innerHTML=this.options.shortDays[e.getDay()]+" "+e.getDate()+"/"+this.options.shortMonths[e.getMonth()];g=0;this.entries.each(function(n){if((n.enddate!==""&&e.isDateBetween(n.startdate,n.enddate))||(n.enddate===""&&n.startdate.isSameDay(e))){var j=this._buildEventOpts({entry:n,curdate:e,divclass:".weekView",tdOffset:k});f.adopt(this._makeEventRelDiv(n,j));g++}}.bind(this));e.setTime(e.getTime()+this.DAY)}},_buildEventOpts:function(a){var f=a.curdate;var p=new CloneObject(a.entry,true,["enddate","startdate"]);var l=this.el.getElements(a.divclass+" tr");var j=(p.startdate.isSameDay(f))?p.startdate.getHours()-this.options.open:0;j=j<0?0:j;var k=a.tdOffset;p.label=p.label?p.label:"";var g=l[j+1].getElements("td")[k+1];var o=p.startdate.getHours();var n=g.getSize().y;this.colwidth[a.divclass]=this.colwidth[a.divclass]?this.colwidth[a.divclass]:g.getSize().x;var m=this.el.getElement(a.divclass).getElement("tr").getSize().y;colwidth=this.colwidth[a.divclass];var e=(colwidth*k);e+=this.el.getElement(a.divclass).getElement("td").getSize().x;var h=Math.ceil(p.enddate.getHours()-p.startdate.getHours());if(h===0){h=1}if(p.startdate.getDay()!==p.enddate.getDay()){h=this.options.open!==0||this.options.close!==24?this.options.close-this.options.open+1:24;if(p.startdate.isSameDay(f)){h=this.options.open!==0||this.options.close!==24?this.options.close-this.options.open+1:24-p.startdate.getHours()}else{p.startdate.setHours(0);if(p.enddate.isSameDay(f)){h=this.options.open!==0||this.options.close!==24?this.options.close-this.options.open:p.enddate.getHours()}}}m=m+(n*j);var r=(n*h);if(p.enddate.isSameDay(f)){r+=(p.enddate.getMinutes()/60*n)}if(p.startdate.isSameDay(f)){m+=(p.startdate.getMinutes()/60*n);r-=(p.startdate.getMinutes()/60*n)}var c=g.getElements(".fabrikEvent");var b=colwidth/(c.length+1);var s=b*c.length;c.setStyle("width",b+"px");var q=a.divclass.substr(1,a.divclass.length);b-=g.getStyle("border-width").toInt();a={"margin-left":s+"px",width:b+"px",height:r,view:"weekView","background-color":this._getColor(this.options.colors.headingBg)};a.left=e;a.top=m;a.color=this._getColor(this.options.colors.headingColor,p.startdate);a.startHour=p.startdate.getHours();a.endHour=a.startHour+h;a.startMin=p.startdate.getMinutes();a.endMin=p.enddate.getMinutes();p.startdate.setHours(o);return a},showDay:function(){var b;var e=new Date();e.setTime(this.date.valueOf());e.setHours(0,0);var a=this.el.getElements(".dayView tr");a[0].childNodes[1].innerHTML=this.options.days[this.date.getDay()];for(var c=1;c<a.length;c++){e.setHours(c-1,0);var f=a[c].getElements("td")[1];if(typeOf(f)!=="null"){f.empty();f.className="";f.addClass("day");f.addClass(e.getTime()-this.HOUR)}}this.entries.each(function(h){if((h.enddate!==""&&this.date.isDateBetween(h.startdate,h.enddate))||(h.enddate===""&&h.startdate.isSameDay(e))){var g=this._buildEventOpts({entry:h,curdate:this.date,divclass:".dayView",tdOffset:0});f.adopt(this._makeEventRelDiv(h,g))}}.bind(this));this.el.getElement(".monthDisplay").innerHTML=(this.date.getDate())+"  "+this.options.months[this.date.getMonth()]+" "+this.date.getFullYear()},renderMonthView:function(){var j,k;this.popWin.setStyle("opacity",0);var a=this._getFirstDayInMonthCalendar(new Date());var f=this.options.days.slice(this.options.first_week_day).concat(this.options.days.slice(0,this.options.first_week_day));var b=new Date();b.setTime(a.valueOf());if(a.getDay()!==this.options.first_week_day){var e=a.getDay()-this.options.first_week_day;b.setTime(a.valueOf()-(e*24*60*60*1000))}this.options.viewType="monthView";if(!this.mothView){tbody=new Element("tbody",{"class":"viewContainerTBody"});k=new Element("tr");for(j=0;j<7;j++){k.adopt(new Element("th",{"class":"dayHeading",styles:{width:"80px",height:"20px","text-align":"center",color:this._getColor(this.options.colors.headingColor,b),"background-color":this._getColor(this.options.colors.headingBg,b)}}).appendText(f[j]));b.setTime(b.getTime()+this.DAY)}tbody.appendChild(k);var n=this.options.colors.highlight;var l=this.options.colors.bg;var h=this.options.colors.today;for(var g=0;g<6;g++){k=new Element("tr");var m=this;for(j=0;j<7;j++){var o=this.options.colors.bg;var c=(this.selectedDate.isSameDay(a))?"selectedDay":"";k.adopt(new Element("td",{"class":"day "+(a.getTime())+c,styles:{width:this.options.monthday.width+"px",height:this.options.monthday.height+"px","background-color":o,"vertical-align":"top",padding:0,border:"1px solid #cccccc"},events:{mouseenter:function(){this.setStyles({"background-color":n})},mouseleave:function(){this.set("morph",{duration:500,transition:Fx.Transitions.Sine.easeInOut});var p=(this.hasClass("today"))?h:l;this.morph({"background-color":[n,p]})},click:function(p){m.selectedDate.setTime(this.className.split(" ")[1]);m.date.setTime(m._getTimeFromClassName(this.className));m.el.getElements("td").each(function(q){q.removeClass("selectedDay");if(q!==this){q.setStyles({"background-color":"#F7F7F7"})}}.bind(this));this.addClass("selectedDay")},dblclick:function(p){this.openAddEvent(p)}.bind(this)}}));a.setTime(a.getTime()+this.DAY)}tbody.appendChild(k)}this.mothView=new Element("div",{"class":"monthView",styles:{position:"relative"}}).adopt(new Element("table",{styles:{"border-collapse":"collapse"}}).adopt(tbody));this.el.getElement(".viewContainer").appendChild(this.mothView)}this.showView("monthView")},_getTimeFromClassName:function(a){return a.replace("today","").replace("selectedDay","").replace("day","").replace("otherMonth","").trim()},openAddEvent:function(j){var k;if(this.options.canAdd===0){return}j.stop();if(j.target.className==="addEventButton"){var a=new Date();k=a.getTime()}else{k=this._getTimeFromClassName(j.target.className)}this.date.setTime(k);d=0;if(!isNaN(k)&&k!==""){var h=new Date();h.setTime(k);var c=h.getMonth()+1;c=(c<10)?"0"+c:c;var l=h.getDate();l=(l<10)?"0"+l:l;var f=h.getHours();f=(f<10)?"0"+f:f;var g=h.getMinutes();g=(g<10)?"0"+g:g;this.doubleclickdate=h.getFullYear()+"-"+c+"-"+l+" "+f+":"+g+":00";d="&jos_fabrik_calendar_events___start_date="+this.doubleclickdate}if(this.options.eventLists.length>1){this.openChooseEventTypeForm(this.doubleclickdate,k)}else{var b={};b.rowid=0;b.id="";d="&"+this.options.eventLists[0].startdate_element+"="+this.doubleclickdate;b.listid=this.options.eventLists[0].value;this.addEvForm(b)}},openChooseEventTypeForm:function(c,a){var b="index.php?option=com_fabrik&tmpl=component&view=visualization&controller=visualization.calendar&task=chooseaddevent&id="+this.options.calendarId+"&d="+c+"&rawd="+a;this.windowopts.contentURL=b;this.windowopts.id="chooseeventwin";this.windowopts.onContentLoaded=function(){var e=new Fx.Scroll(window).toElement("chooseeventwin")};Fabrik.getWindow(this.windowopts)},addEvForm:function(c){console.log("addEvForm",c);var a="index.php?option=com_fabrik&controller=visualization.calendar&view=visualization&task=addEvForm&format=raw&listid="+c.listid+"&rowid="+c.rowid;a+="&jos_fabrik_calendar_events___visualization_id="+this.options.calendarId;a+="&visualizationid="+this.options.calendarId;if(typeof(this.doubleclickdate)!=="undefined"){a+="&start_date="+this.doubleclickdate}this.windowopts.type="window";this.windowopts.contentURL=a;this.windowopts.id="addeventwin";var b=this.options.filters;this.windowopts.onContentLoaded=function(e){var f=new Fx.Scroll(window).toElement("addeventwin");b.each(function(g){if($(g.key)){switch($(g.key).get("tag")){case"select":$(g.key).selectedIndex=g.val;break;case"input":$(g.key).value=g.val;break}}});e.fitToContent()}.bind(this);Fabrik.getWindow(this.windowopts)},_highLightToday:function(){var a=new Date();this.el.getElements(".viewContainerTBody td").each(function(c){var b=new Date(this._getTimeFromClassName(c.className).toInt());if(a.equalsTo(b)){c.addClass("today")}else{c.removeClass("today")}}.bind(this))},centerOnToday:function(){this.date=new Date();this.showView()},renderDayView:function(){var b,c;this.popWin.setStyle("opacity",0);this.options.viewType="dayView";if(!this.dayView){tbody=new Element("tbody");b=new Element("tr");for(c=0;c<2;c++){if(c===0){b.adopt(new Element("td",{"class":"day"}))}else{b.adopt(new Element("th",{"class":"dayHeading",styles:{width:"80px",height:"20px","text-align":"center",color:this.options.headingColor,"background-color":this.options.colors.headingBg}}).appendText(this.options.days[this.date.getDay()]))}}tbody.appendChild(b);this.options.open=this.options.open<0?0:this.options.open;(this.options.close>24||this.options.close<this.options.open)?this.options.close=24:this.options.close;for(i=this.options.open;i<(this.options.close+1);i++){b=new Element("tr");for(c=0;c<2;c++){if(c===0){var a=(i.length===1)?i+"0:00":i+":00";b.adopt(new Element("td",{"class":"day"}).appendText(a))}else{b.adopt(new Element("td",{"class":"day",styles:{width:"100%",height:"10px","background-color":"#F7F7F7","vertical-align":"top",padding:0,border:"1px solid #cccccc"},events:{mouseenter:function(f){this.setStyles({"background-color":"#FFFFDF"})},mouseleave:function(f){this.setStyles({"background-color":"#F7F7F7"})},dblclick:function(f){this.openAddEvent(f)}.bind(this)}}))}}tbody.appendChild(b)}this.dayView=new Element("div",{"class":"dayView",styles:{position:"relative"}}).adopt(new Element("table",{"class":"",styles:{"border-collapse":"collapse"}}).adopt(tbody));this.el.getElement(".viewContainer").appendChild(this.dayView)}this.showDay();this.showView("dayView")},showView:function(a){if(this.el.getElement(".dayView")){this.el.getElement(".dayView").style.display="none"}if(this.el.getElement(".weekView")){this.el.getElement(".weekView").style.display="none"}if(this.el.getElement(".monthView")){this.el.getElement(".monthView").style.display="none"}this.el.getElement("."+this.options.viewType).style.display="block";switch(this.options.viewType){case"dayView":this.showDay();break;case"weekView":this.showWeek();break;default:case"monthView":this.showMonth();break}Cookie.write("fabrik.viz.calendar.view",this.options.viewType)},renderWeekView:function(){var e,g,f,b,c;this.popWin.setStyle("opacity",0);c=this.options.showweekends===false?6:8;this.options.viewType="weekView";if(!this.weekView){b=new Element("tbody");f=new Element("tr");for(g=0;g<c;g++){if(g===0){f.adopt(new Element("td",{"class":"day"}))}else{f.adopt(new Element("th",{"class":"dayHeading",styles:{width:this.options.weekday.width+"px",height:(this.options.weekday.height-10)+"px","text-align":"center",color:this.options.headingColor,"background-color":this.options.colors.headingBg},events:{click:function(j){j.stop();this.selectedDate.setTime(j.target.className.replace("dayHeading ","").toInt());var h=new Date();j.target.getParent().getParent().getElements("td").each(function(l){var k=l.className.replace("day ","").replace(" selectedDay").toInt();h.setTime(k);if(h.getDayOfYear()===this.selectedDate.getDayOfYear()){l.addClass("selectedDay")}else{l.removeClass("selectedDay")}}.bind(this))}.bind(this)}}).appendText(this.options.days[g-1]))}}b.appendChild(f);this.options.open=this.options.open<0?0:this.options.open;(this.options.close>24||this.options.close<this.options.open)?this.options.close=24:this.options.close;for(e=this.options.open;e<(this.options.close+1);e++){f=new Element("tr");for(g=0;g<c;g++){if(g===0){var a=(e.length===1)?e+"0:00":e+":00";f.adopt(new Element("td",{"class":"day"}).appendText(a))}else{f.adopt(new Element("td",{"class":"day",styles:{width:this.options.weekday.width+"px",height:this.options.weekday.height+"px","background-color":"#F7F7F7","vertical-align":"top",padding:0,border:"1px solid #cccccc"},events:{mouseenter:function(h){if(!this.hasClass("selectedDay")){this.setStyles({"background-color":"#FFFFDF"})}},mouseleave:function(h){if(!this.hasClass("selectedDay")){this.setStyles({"background-color":"#F7F7F7"})}},dblclick:function(h){this.openAddEvent(h)}.bind(this)}}))}}b.appendChild(f)}this.weekView=new Element("div",{"class":"weekView",styles:{position:"relative"}}).adopt(new Element("table",{styles:{"border-collapse":"collapse"}}).adopt(b));this.el.getElement(".viewContainer").appendChild(this.weekView)}this.showWeek();this.showView("weekView")},render:function(c){this.setOptions(c);this.windowopts.title=Joomla.JText._("PLG_VISUALIZATION_CALENDAR_ADD_EDIT_EVENT");this.windowopts.y=this.options.popwiny;this.popWin=this._makePopUpWin();var f=this.options.urlfilters;f.visualizationid=this.options.calendarId;if(this.firstRun){this.firstRun=false;f.resetfilters=this.options.restFilterStart}this.ajax.updateEvents=new Request({url:this.options.url.add,data:f,evalScripts:true,onComplete:function(h){var j=h.stripScripts(true);var g=JSON.decode(j);this.addEntries(g);this.showView()}.bind(this)});this.ajax.deleteEvent=new Request({url:this.options.url.del,data:{visualizationid:this.options.calendarId},onComplete:function(h){h=h.stripScripts(true);var g=JSON.decode(h);this.entries=$H();this.addEntries(g)}.bind(this)});if(typeOf(this.el.getElement(".addEventButton"))!=="null"){this.el.getElement(".addEventButton").addEvent("click",function(g){this.openAddEvent(g)}.bind(this))}var b=[];b.push(new Element("li",{"class":"centerOnToday"}).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_TODAY")));if(this.options.show_day){b.push(new Element("li",{"class":"dayViewLink"}).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_DAY")))}if(this.options.show_week){b.push(new Element("li",{"class":"weekViewLink"}).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_WEEK")))}if(this.options.show_week||this.options.show_day){b.push(new Element("li",{"class":"monthViewLink"}).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_MONTH")))}var e=new Element("div",{"class":"calendarNav"}).adopt(new Element("input",{"class":"previousPage",type:"button",value:Joomla.JText._("PLG_VISUALIZATION_CALENDAR_PREVIOUS")}),new Element("input",{"class":"nextPage",type:"button",value:Joomla.JText._("PLG_VISUALIZATION_CALENDAR_NEXT")}),new Element("div",{"class":"monthDisplay"}),new Element("ul",{"class":"viewMode"}).adopt(b));this.el.appendChild(e);this.el.appendChild(new Element("div",{"class":"viewContainer",styles:{"background-color":"#EFEFEF",padding:"5px"}}));if($type(Cookie.read("fabrik.viz.calendar.date"))!==false){this.date=new Date(Cookie.read("fabrik.viz.calendar.date"))}var a=typeOf(Cookie.read("fabrik.viz.calendar.view"))==="null"?this.options.viewType:Cookie.read("fabrik.viz.calendar.view");switch(a){case"dayView":this.renderDayView();break;case"weekView":this.renderWeekView();break;default:case"monthView":this.renderMonthView();break}this.showView();this.el.getElement(".nextPage").addEvent("click",function(g){this.nextPage(g)}.bind(this));this.el.getElement(".previousPage").addEvent("click",function(g){this.previousPage(g)}.bind(this));if(this.options.show_day){this.el.getElement(".dayViewLink").addEvent("click",function(g){this.renderDayView(g)}.bind(this))}if(this.options.show_week){this.el.getElement(".weekViewLink").addEvent("click",function(g){this.renderWeekView(g)}.bind(this))}if(this.options.show_week||this.options.show_day){this.el.getElement(".monthViewLink").addEvent("click",function(g){this.renderMonthView(g)}.bind(this))}this.el.getElement(".centerOnToday").addEvent("click",function(g){this.centerOnToday(g)}.bind(this));this.showMonth();this.ajax.updateEvents.send()},showMessage:function(a){this.el.getElement(".calendar-message").set("html",a);this.fx.showMsg.start({opacity:[0,1]}).chain(function(){this.start.delay(2000,this,{opacity:[1,0]})})},addEntry:function(b,g){var f,c,a,e;if(g.startdate){f=g.startdate.split(" ");f=f[0];if(f.trim()===""){return}e=g.startdate.split(" ");e=e[1];e=e.split(":");f=f.split("-");c=new Date();a=(f[1]).toInt()-1;c.setYear(f[0]);c.setMonth(a,f[2]);c.setDate(f[2]);c.setHours(e[0].toInt());c.setMinutes(e[1].toInt());c.setSeconds(e[2].toInt());g.startdate=c;this.entries.set(b,g);if(g.enddate){f=g.enddate.split(" ");f=f[0];if(f.trim()===""){return}if(f==="0000-00-00"){g.enddate=g.startdate;return}e=g.enddate.split(" ");e=e[1];e=e.split(":");f=f.split("-");c=new Date();a=(f[1]).toInt()-1;c.setYear(f[0]);c.setMonth(a,f[2]);c.setDate(f[2]);c.setHours(e[0].toInt());c.setMinutes(e[1].toInt());c.setSeconds(e[2].toInt());g.enddate=c}}},deleteEntry:function(f){var c=this.activeHoverEvent.id.replace("fabrikEvent_","");var b=c.split("_");var a=b[0];if(!this.options.deleteables.contains(a)){return}if(confirm(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_CONF_DELETE"))){this.ajax.deleteEvent.options.data={id:b[1],listid:a};this.ajax.deleteEvent.send();document.id(this.activeHoverEvent).fade("out");this.fx.showEventActions.start({opacity:[1,0]});this.removeEntry(c);this.activeDay=null}},editEntry:function(b){var c={};c.id=this.options.formid;var a=this.activeHoverEvent.id.replace("fabrikEvent_","").split("_");c.rowid=a[1];c.listid=a[0];this.addEvForm(c)},addEntries:function(b){b=$H(b);b.each(function(c,a){this.addEntry(a,c)}.bind(this));this.showView()},removeEntry:function(a){this.entries.erase(a);this.showView()},nextPage:function(){this.popWin.setStyle("opacity",0);switch(this.options.viewType){case"dayView":this.date.setTime(this.date.getTime()+this.DAY);this.showDay();break;case"weekView":this.date.setTime(this.date.getTime()+this.WEEK);this.showWeek();break;case"monthView":this.date.setDate(1);this.date.setMonth(this.date.getMonth()+1);this.showMonth();break}Cookie.write("fabrik.viz.calendar.date",this.date)},previousPage:function(){this.popWin.setStyle("opacity",0);switch(this.options.viewType){case"dayView":this.date.setTime(this.date.getTime()-this.DAY);this.showDay();break;case"weekView":this.date.setTime(this.date.getTime()-this.WEEK);this.showWeek();break;case"monthView":this.date.setMonth(this.date.getMonth()-1);this.showMonth();break}Cookie.write("fabrik.viz.calendar.date",this.date)},addLegend:function(b){var c=new Element("ul");b.each(function(e){var a=new Element("li");a.adopt(new Element("div",{styles:{"background-color":e.colour}}),new Element("span").appendText(e.label));c.appendChild(a)}.bind(this));new Element("div",{"class":"legend"}).adopt([new Element("h3").appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_KEY")),c]).inject(this.el,"after")},_getGreyscaleFromRgb:function(c){var f=parseInt(c.substring(1,3),16);var e=parseInt(c.substring(3,5),16);var a=parseInt(c.substring(5),16);var h=parseInt(0.3*f+0.59*e+0.11*a,10);return"#"+h.toString(16)+h.toString(16)+h.toString(16)},_getColor:function(a,e){if(this.options.greyscaledweekend===0){return a}var b=new Color(a);if(typeOf(e)!=="null"&&(e.getDay()===0||e.getDay()===6)){return this._getGreyscaleFromRgb(a)}else{return a}}});Date._MD=new Array(31,28,31,30,31,30,31,31,30,31,30,31);Date.SECOND=1000;Date.MINUTE=60*Date.SECOND;Date.HOUR=60*Date.MINUTE;Date.DAY=24*Date.HOUR;Date.WEEK=7*Date.DAY;Date.prototype.getMonthDays=function(b){var a=this.getFullYear();if(typeof b==="undefined"){b=this.getMonth()}if(((0===(a%4))&&((0!==(a%100))||(0===(a%400))))&&b===1){return 29}else{return Date._MD[b]}};Date.prototype.isSameWeek=function(a){return((this.getFullYear()===a.getFullYear())&&(this.getMonth()===a.getMonth())&&(this.getWeekNumber()===a.getWeekNumber()))};Date.prototype.isSameDay=function(a){return((this.getFullYear()===a.getFullYear())&&(this.getMonth()===a.getMonth())&&(this.getDate()===a.getDate()))};Date.prototype.isSameHour=function(a){return((this.getFullYear()===a.getFullYear())&&(this.getMonth()===a.getMonth())&&(this.getDate()===a.getDate())&&(this.getHours()===a.getHours()))};Date.prototype.isDateBetween=function(c,b){var e=c.getFullYear()*10000+(c.getMonth()+1)*100+c.getDate();var f=b.getFullYear()*10000+(b.getMonth()+1)*100+b.getDate();var a=this.getFullYear()*10000+(this.getMonth()+1)*100+this.getDate();return e<=a&&a<=f};