const getFormattedHour = (hour) => {
	if (hour == 0) {
		return "12";
	}
	else if (hour <= 12) {
		return hour;
	} else {
		return hour % 12;
	}
}

const addLeadingZero = (num) => {
	if (num < 10) {
		return "0" + num;
	} else {
		return num;
	}
}

const longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const getLongMonth = (month) => {
	return longMonths[month];
}

const getLongDay = (day) => {
	if (day > 3 && day < 21) return 'th';
	switch (day % 10) {
		case 1: return 'st';
		case 2: return 'nd';
		case 3: return 'rd';
		default: return 'th';
	}
}

export const prettyFormat = (timestamp) => {
	var date = new Date(timestamp);

	const month = getLongMonth(date.getMonth());
	const day = date.getDate() + getLongDay(date.getDate());
	const year = date.getFullYear();


	return `${month} ${day}, ${year}`;
};

export const dateAwareFormat = (timestamp) => {
	var originalDate = new Date(timestamp);
	var currDate = new Date();
	var yesterday = new Date();
	yesterday.setDate(currDate.getDate() - 1);

	const month = originalDate.getMonth()+1;
	const day = originalDate.getDate();
	const year = originalDate.getFullYear();

	const hour = getFormattedHour(originalDate.getHours());
	const minute = addLeadingZero(originalDate.getMinutes());
	const amPm = originalDate.getHours() > 11 ? "PM" : "AM";



	if ((originalDate.getMonth() == currDate.getMonth()) &&
		(originalDate.getDate() == currDate.getDate()) &&
		(originalDate.getFullYear() == currDate.getFullYear())) {
		return `today, ${hour}:${minute} ${amPm}`;
	} else if ((originalDate.getMonth() == yesterday.getMonth()) &&
		(originalDate.getDate() == yesterday.getDate()) &&
		(originalDate.getFullYear() == yesterday.getFullYear())) {
		return `yesterday, ${hour}:${minute} ${amPm}`;
	} else {
		return `${month}/${day}/${year} ${hour}:${minute} ${amPm}`;
	}
};

export const quickFormat = (timestamp) => {
	var date = new Date(timestamp); // The 0 there is the key, which sets the date to the epoch

	const month = date.getMonth()+1;
	const day = date.getDate();
	const year = date.getFullYear();

	const hour = getFormattedHour(date.getHours());
	const minute = addLeadingZero(date.getMinutes());
	const amPm = date.getHours() > 11 ? "PM" : "AM";

	return `${month}/${day}/${year} ${hour}:${minute} ${amPm}`;
};

