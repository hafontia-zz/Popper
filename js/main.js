
var POPPER = { };
POPPER.Models = { };
POPPER.Views = { };

POPPER.Models.sentence = Backbone.Model.extend({ });

POPPER.Models.sentences = Backbone.Collection.extend({

	model: POPPER.Models.sentence,
	
	url: 'js/sentences.json',
	
	colorCycle: 1,
	
	maxColors: 4,
	
	pos: 0,
	
	nextColor: function() {
		this.colorCycle = (this.colorCycle == this.maxColors) ? 1 : this.colorCycle + 1;
		return this.colorCycle;
	}
	
});

POPPER.Views.sentence = Backbone.View.extend({
	
	tagName: 'div',
	
	className: 'sentence',
	
	render: function() {
		$('#' + this.model.id).remove();
		this.$el.attr( 'id', this.model.cid );
		this.$el.addClass( 'color' + this.model.get('color') );
		setTimeout(_.bind(function() {
			this.show();
		}, this), 200);
		this.$el.html( this.model.get('content') );
		if ( this.model.get('class') ) {
			
			this.$el.addClass( this.model.get('class') );
			
		}
		return this.$el;
	},
	
	show: function() {
		this.$el.addClass('show');
	}
	
});

POPPER.Views.sentences = Backbone.View.extend({
	
	initialize: function() {
		this.$el.fitText();	
	},
	
	addSentence: function() {
		var sentence = this.collection.at( this.collection.pos );
		sentence.set( 'color', this.collection.nextColor() );
		( new POPPER.Views.sentence({ model: sentence }) )
			.render()
			.appendTo( this.$el );
        this.collection.pos = ( this.collection.pos == this.collection.length - 1 ) ? 0 : this.collection.pos + 1;

	},
	
	addSentenceRecursive: function() {
		if (!this.collection.length) return;
		this.addSentence();

		setTimeout(
			_.bind(this.addSentenceRecursive, this),
			1000
		);
	}
	
});

$(function() {
	$('header').fitText(3);
	POPPER.sentences = new POPPER.Models.sentences();
	POPPER.sentencesView = new POPPER.Views.sentences({
		el: $('.sentence-stack'),
		collection: POPPER.sentences
	});
	POPPER.sentences.fetch({
		success: function() {
			POPPER.sentencesView.addSentenceRecursive();
		}
	});

});