const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_VIDEOS_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

const holidayDates = [
  "2024-01-01",
  "2024-01-15",
  "2024-01-26",
  "2024-02-14",
  "2024-03-25",
  "2024-03-29",
  "2024-04-09",
  "2024-04-11",
  "2024-06-17",
  "2024-08-15",
  "2024-08-19",
  "2024-08-26",
  "2024-10-02",
  "2024-10-31",
  "2024-12-25",
];

// const leaveReasons = [
//   { reason: "Long leave for the student's medical issue", type: "LONG" },
//   {
//     reason:
//       "Long leave for the medical issue of a student's parents or grandparents",
//     type: "LONG",
//   },
//   { reason: "Short leave for festivals", type: "FESTIVE" },
//   {
//     reason: "Short leave for government office appointments",
//     type: "GOVERMENT",
//   },
//   { reason: "Short leave for doctor's appointments", type: "MEDICAL" },
//   { reason: "Other reasons", type: "OTHER" },
// ];

const leaveReasonsData = {
  Regular: [
    { reason: "Home Outing", type: "REGULAR" },
    { reason: "Shopping", type: "REGULAR" },
    { reason: "Festival", type: "REGULAR" },
    { reason: "Government official appointment", type: "GOVERNMENT" },
  ],
  Medical: [
    {
      reason: "Medical Issue of Student",
      type: "MEDICAL",
    },
    {
      reason: "Medical Issue of Parents",
      type: "MEDICAL",
    },
    {
      reason: "Appointment with Doctor",
      type: "MEDICAL",
    },
    {
      reason: "Medical Issue of Relatives",
      type: "MEDICAL",
    },
  ],
  Emergency: [
    { reason: "Demise of a Relative", type: "EMERGENCY" },
    { reason: "Medical Emergency", type: "EMERGENCY" },
    { reason: "Other reasons", type: "OTHERS" },
  ],
};

const applicationStatus = {
  PENDING: "Pending",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
};

export {
  MAX_FILE_SIZE,
  MAX_VIDEO_SIZE,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEOS_TYPES,
  holidayDates,
  leaveReasonsData,
  applicationStatus,
};
