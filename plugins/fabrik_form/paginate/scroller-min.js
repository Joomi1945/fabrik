FabRecordSet=new Class({initialize:function(c,a){this.form=c;this.options={};$extend(this.options,a);var d=this.form.getForm();var b=d.getElement("input[name=listid]").get("value");this.pkfield=d.getElement("input[name=rowid]");var e=this.form.id;this.view=this.form.options.editable===true?"form":"details";this.url=this.options.liveSite+"index.php?option=com_fabrik&format=raw&controller=plugin&g=form&task=pluginAjax&plugin=paginate&method=xRecord&formid="+e+"&mode="+this.options.view+"&rowid=";this.watchButtons()},doUpdate:function(a){var c=Json.evaluate(a.stripScripts());this.options.ids=c.ids;var b=this.view==="form"?c.data:c.html;this.form.formElements.each(function(d,e){var f=b[e];try{if(typOf(f)!=="null"){this.view==="form"?d.update(f):d.set("html",Encoder.htmlDecode(f))}else{this.view==="form"?d.update(""):d.set("html","")}}catch(g){console.log(d,f,g)}}.bind(this));this.pkfield.value=b[this.options.pkey];if(typeof(Slimbox)!=="undefined"){Slimbox.scanPage()}if(typeof(Lightbox)!=="undefined"){Lightbox.init()}if(typeof(Mediabox)!=="undefined"){Mediabox.scanPage()}window.fireEvent("fabrik.form.refresh",[c.post.rowid]);oPackage.stopLoading(this.form.getBlock())},doNav:function(d,b){d.stop();var c=true;switch(b){case 0:if(this.options.ids.index===0||this.options.ids.index===1){c=false}rowid=this.options.ids.first;break;case 2:if(this.options.ids.index===this.options.ids.lastKey){c=false}rowid=this.options.ids.last;break;case -1:if(this.options.ids.index===0||this.options.ids.index===1){c=false}rowid=this.options.ids.prev;break;case 1:if(this.options.ids.index===this.options.ids.lastKey){c=false}rowid=this.options.ids.next;break}if(!c){return}oPackage.startLoading(this.form.getBlock());var a=new Request({url:this.url+rowid,evalScripts:true,onComplete:function(e){this.doUpdate(e)}.bind(this)}).send()},watchButtons:function(){var b,a;a=this.form.getForm();b=a.getElement("ul.pagination");b.getElement(".paginateNext").addEvent("click",function(c){this.doNav(c,1)}.bind(this));b.getElement(".paginatePrevious").addEvent("click",function(c){this.doNav(c,-1)}.bind(this));b.getElement(".paginateLast").addEvent("click",function(c){this.doNav(c,2)}.bind(this));b.getElement(".paginateFirst").addEvent("click",function(c){this.doNav(c,0)}.bind(this))}});