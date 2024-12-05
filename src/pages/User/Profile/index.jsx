import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";


function Profile() {
  const dispatch = useDispatch();
  const onPressInfo = async () => {

  };

  return (
    <>
      <Button type="primary" onClick={onPressInfo}>
        get info
      </Button>
      <div>Profile</div>
    </>
  );
}

export default Profile;
