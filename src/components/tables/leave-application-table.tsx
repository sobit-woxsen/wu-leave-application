// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { ViewLeaveApplicationDrawer } from "@/components/drawers/view-leave-application-drawer";

// import bcomApplications from "@/data/bcom.json";

// export function LeaveApplications({ applications }) {
//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead className="w-[300px]">Name</TableHead>
//           <TableHead>Semester</TableHead>
//           <TableHead>Email</TableHead>
//           <TableHead className="text-right">View Application</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody className="border-[1.2px] border-slate-600/20">
//         {applications.map(
//           (
//             {
//               leaveReason,
//               status,
//               videoUrl,
//               documentUrl,
//               totalLeaves,
//               createdAt,
//               startDate,
//               endDate,
//               leaveType,
//               studentEmail,
//             },
//             index
//           ) => (
//             <TableRow key={index}>
//               {/* <TableCell className="h-6 flex  line-clamp-1 md:line-clamp-none font-medium">
//                 {fullName}
//               </TableCell>
//               <TableCell className="">{semester}</TableCell> */}
//               <TableCell className="lowercase">{studentEmail}</TableCell>
//               <TableCell className="text-right">
//                 <ViewLeaveApplicationDrawer studentEmail={studentEmail} />
//               </TableCell>
//             </TableRow>
//           )
//         )}
//       </TableBody>
//     </Table>
//   );
// }
