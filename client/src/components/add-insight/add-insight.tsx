import { useState } from "react";
import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";


// type AddInsightProps = ModalProps;
type AddInsightProps = ModalProps & {
  onSuccess?: () => void; // callback after successful add
};

export const AddInsight = ({ onSuccess, ...props }: AddInsightProps) => {
 const [brand, setBrand] = useState(BRANDS[0]?.id ?? 0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  // const addInsight = () => undefined;
 const addInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, text }),
      });

      if (!res.ok) {
        throw new Error(`Failed to add insight: ${res.statusText}`);
      }

      setText("");
      onSuccess?.();  // Let parent know to refresh list or close modal
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form} onSubmit={addInsight}>
        <label className={styles.field}>
          Brand
          <select
            className={styles["field-input"]}
            value={brand}
            onChange={(e) => setBrand(Number(e.target.value))}
          >
            {BRANDS.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Insight
          <textarea
            className={styles["field-input"]}
            rows={5}
            placeholder="Something insightful..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </label>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button
          className={styles.submit}
          type="submit"
          label={loading ? "Adding..." : "Add insight"}
          disabled={loading}
        />
      </form>
    </Modal>
  );
};
