// import { Trash2Icon } from "lucide-react";
// import { cx } from "../../lib/cx.ts";
// import styles from "./insights.module.css";
// import type { Insight } from "../../schemas/insight.ts";

// type InsightsProps = {
//   insights: Insight[];
//   className?: string;
// };

// export const Insights = ({ insights, className }: InsightsProps) => {
//   const deleteInsight = () => undefined;

//   return (
//     <div className={cx(className)}>
//       <h1 className={styles.heading}>Insights</h1>
//       <div className={styles.list}>
//         {insights?.length
//           ? (
//             insights.map(({ id, text, date, brandId }) => (
//               <div className={styles.insight} key={id}>
//                 <div className={styles["insight-meta"]}>
//                   <span>{brandId}</span>
//                   <div className={styles["insight-meta-details"]}>
//                     <span>{date.toString()}</span>
//                     <Trash2Icon
//                       className={styles["insight-delete"]}
//                       onClick={deleteInsight}
//                     />
//                   </div>
//                 </div>
//                 <p className={styles["insight-content"]}>{text}</p>
//               </div>
//             ))
//           )
//           : <p>We have no insight!</p>}
//       </div>
//     </div>
//   );
// };
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DeleteIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import type { Insight } from "../../schemas/insight.ts";

type InsightsProps = {
  className?: string;
};

export const Insights = ({ className }: InsightsProps) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      const res = await fetch("http://localhost:8000/insights");
      const data = await res.json();
      setInsights(data);
    } catch (err) {
      console.error("Failed to fetch insights:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteInsight = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/insights/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setInsights((prev) => prev.filter((i) => i.id !== id));
      } else {
        console.error("Failed to delete insight", await res.text());
      }
    } catch (err) {
      console.error("Error deleting insight:", err);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={className}>
      <Typography variant="h5" gutterBottom>
        Insights
      </Typography>
      {insights.length > 0 ? (
         <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Text</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {insights.map(({ id, brandId, text, date }) => {
            const dateObj = new Date(date);
            const dateStr = dateObj.toLocaleDateString("en-GB");
            const timeStr = dateObj.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>{brandId}</TableCell>
                <TableCell>{text}</TableCell>
                <TableCell>{dateStr}</TableCell>
                <TableCell>{timeStr}</TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => deleteInsight(id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
      ) : (
        <Typography variant="body1">No insights found.</Typography>
      )}
    </div>
  );
};
