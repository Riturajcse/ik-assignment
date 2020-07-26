# Interview Kickstart - Assignment

Interview Kickstart (IK) offers 15 mock interviews to every student who enrolls in our course. We need to build an API that can service requests from any client and either return an interview slot or return no slots available. The constraints are

- The Interviewers provide their own availability. They are not available 24/7 for any slot that the student requests. 

- A student should not be able to see any interviews if they have already completed their 15

- A student should only see slots from an interviewer who has not interviewed the student before.

- A student should only see additional interviews if they have not given an interview before or their last 2 interview grades are > 1. (We have a grading scale from 0 - 5). 


The input request looks like this


{

	‘studentId’: 123,

	“startDateTime: ‘2020-06-05T13:00:00’,

	“endDateTime”: ‘2020-06-05T14:00:00’,

}


## Db models

![alt text](https://github.com/Riturajcse/ik-assignment/blob/master/ik-image.png?raw=true)
