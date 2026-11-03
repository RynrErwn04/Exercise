import { useParams } from "react-router-dom";

const users = {
    1: { name: "Syazwan", age: 30, status: "Married"},
    2: { name: "Danial", age: 35, status: "Engaged"},
    3: { name: "Weallfearnius", age: 40, status: "Taken" },
};

function UserProfile() {
    const {id} = useParams();
    const user = users[id];

    if (!user) return <p> User not found </p>;

    return (
        <>
          <h2> User Profile</h2>
          <p> Name: {user.name}</p>
          <p>Age: {user.age}</p>
          <p> Status: {user.status}</p>
        </>
    );
}

export default UserProfile; 

