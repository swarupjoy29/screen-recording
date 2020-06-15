import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recording',
  templateUrl: './recording.component.html',
  styleUrls: ['./recording.component.scss']
})
export class RecordingComponent implements OnInit {
	isJSLoaded= false;
  constructor() { }

  ngOnInit() {
  const self = this;
  	this.loadJS('assets/js/RecordRTC.js', function(){
	  	self.loadJS('assets/js/recordScreen.js', function(){
	  		self.isJSLoaded = true;
	  	});
  	});
  }

  loadJS(file, callback = function(){}) {
	    // DOM: Create the script element
	    var jsElm = document.createElement("script");
	    // set the type attribute
	    jsElm.type = "application/javascript";
	    // make the script element load file
	    jsElm.src = file;
	    // finally insert the element to the body element in order to load the script
	    jsElm.onload = function(){
	    	callback();
	    }
	    document.body.appendChild(jsElm);
	}

}
