import { Link } from "react-router-dom";
import Button from "../components/common/Button";

export default function NotFound() {
  return (
    <div className="card">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/"><Button>Go Home</Button></Link>
    </div>
  );
}
