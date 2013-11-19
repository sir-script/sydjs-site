var keystone = require('keystone'),
	Types = keystone.Field.Types;

var RSVP = new keystone.List('RSVP');

RSVP.add({
	meetup: { type: Types.Relationship, ref: 'Meetup', required: true, initial: true, index: true },
	who: { type: Types.Relationship, ref: 'User', required: true, initial: true, index: true },
	createdAt: { type: Date, noedit: true, collapse: true, default: Date.now },
	changedAt: { type: Date, noedit: true, collapse: true }
});

RSVP.schema.pre('save', function(next) {
	this.changedAt = Date.now();
});

RSVP.schema.post('save', function() {
	keystone.list('Meetup').model.findById(this.meetup, function(err, meetup) {
		if (meetup) meetup.refreshRSVPs();
	});
});

RSVP.defaultColumns = 'meetup, who, createdAt';
RSVP.defaultSort = '-createdAt';
RSVP.register();
