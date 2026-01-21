import { Link } from "react-router-dom";
import Button from "../components/common/Button";

export default function Unauthorized() {
  return (
    <div className="card">
      <h1>Unauthorized</h1>
      <p>You don’t have permission to access this page.</p>
      <Link to="/"><Button>Go Home</Button></Link>
    </div>
  );
}
