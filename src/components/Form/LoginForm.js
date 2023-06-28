import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contex/AuthContext';
import Toast from '../../Utils/Toast';

export default function LoginForm() {
    const { Login } = useAuth();
    const history = useNavigate()
    const onFinish = (values) => {

        Login(values.username, values.password)
        // if (localStorage.getItem('userName')) {
        //     history("/dashboard/1")
        // }
        // history("/dashboard/1")

    };

    const onFinishFailed = (errorInfo) => {
        Toast('err', errorInfo || 'Something went wrong1')
    };

    return (
        <Form
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="on"
            layout="vertical"
        >
            <Form.Item
                label="Username"
                name="username"
                labelAlign='right'

                rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item className="text-center">
                <Button htmlType="submit" type='primary' className="w-100 " >
                    Login
                </Button>
            </Form.Item>
        </Form>
    );
};

