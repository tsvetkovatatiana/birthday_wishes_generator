import {useForm, Controller} from 'react-hook-form';
import React, {useState} from "react";
import axios from 'axios';

interface FormData {
    name: string;
    style: string;
    hobbies: string;
    personality: string;
    specificMessage: string;
}

export default function WishForm() {
    const {handleSubmit, control, formState: {errors}} = useForm<FormData>();
    const [loading, setLoading] = React.useState(false);
    const [response, setResponse] = useState('');

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setResponse('');

        const payload = {
            name: data.name,
            style: data.style,
            hobbies: data.hobbies
                ? data.hobbies.split(',').map(h => h.trim())
                : [],
            personality: data.personality
                ? data.personality.split(',').map(p => p.trim())
                : [],
            specific_message: data.specificMessage || ''
        };

        try {
            const res = await axios.post('http://0.0.0.0:8000/generate_wish/', payload);
            setResponse(res.data.wish);
        } catch (error) {
            console.error(error);
            setResponse('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={"container-form-and-response"}>
            <div className="wish-form-container">
                <div className="wish-form-paper">
                    <h1>Welcome to the Birthday Wish Generator!</h1>
                    <p>
                        Fill out the form below to generate a personalized birthday wish.
                        Provide details like the recipient's name, the desired style of the message,
                        their hobbies, and personality traits. You can also include a specific message to be added.
                    </p>
                </div>
            </div>
            <div className="wish-form-container">
                <div className="wish-form-paper">
                    <h2>Generate a Wish</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="wish-form">
                        <div className="form-row">
                            <div className="form-group">
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{required: 'Name is required'}}
                                    render={({field}) => (
                                        <input
                                            type="text"
                                            placeholder="Recipient's Name"
                                            {...field}
                                            className={errors.name ? 'error' : ''}
                                        />
                                    )}
                                />
                                {errors.name && <small className="error-text">{errors.name.message}</small>}
                            </div>
                            <div className="form-group">
                                <Controller
                                    name="style"
                                    control={control}
                                    rules={{required: 'Style is required'}}
                                    render={({field}) => (
                                        <input
                                            type="text"
                                            placeholder="Message Style (e.g., funny, heartfelt)"
                                            {...field}
                                            className={errors.style ? 'error' : ''}
                                        />
                                    )}
                                />
                                {errors.style && <small className="error-text">{errors.style.message}</small>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <Controller
                                    name="hobbies"
                                    control={control}
                                    render={({field}) => (
                                        <input
                                            type="text"
                                            placeholder="Hobbies (e.g., reading, hiking)"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            <div className="form-group">
                                <Controller
                                    name="personality"
                                    control={control}
                                    render={({field}) => (
                                        <input
                                            type="text"
                                            placeholder="Personality (e.g., kind, funny)"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <Controller
                                name="specificMessage"
                                control={control}
                                render={({field}) => (
                                    <textarea
                                        placeholder="Specific Message (optional)"
                                        rows={3}
                                        {...field}
                                    />
                                )}
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" disabled={loading}>
                                {loading ? 'Generating...' : 'Generate Wish'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="wish-form-container">
                <div className="wish-form-paper">
                    {response && (
                        <div className="wish-response">
                            <h3>Your Birthday Wish:</h3>
                            <p>{response}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
