import { Route, Redirect } from 'react-router-dom';
import { useProtectedRoute } from '../provider/AuthProvider';


const ProtectedRoute = ({ children, ...props }) => {

    const { isAllowed } = useProtectedRoute();
    return (
        <Route {...props} render={() => (isAllowed ?
            children
            :
            <Redirect to="/" />)}
        />
    )
}

export default ProtectedRoute;
