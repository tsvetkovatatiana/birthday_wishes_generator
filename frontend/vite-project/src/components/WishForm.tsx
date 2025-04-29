import { useForm, Controller } from 'react-hook-form';
import * as React from "react";

interface FormData {
    name: string;
    style: string;
    hobbies: string;
    personality: string;
    specificMessage: string;
}

export default function WishForm() {
    const { handleSubmit, control, formState: { errors } } = useForm<FormData>();
    const [loading, setLoading] = React.useState(false);

    const onSubmit = (data: FormData) => {
        setLoading(true);
        console.log('Form Data:', data);
        setTimeout(() => {
            setLoading(false);
            alert('Wish Generated!');
        }, 1000);
    };

    return (
        <div className="wish-form-container">
            <div className="wish-form-paper">
                <h2>Generate a Wish</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="wish-form">
                    <div className="form-row">
                        <div className="form-group">
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'Name is required' }}
                                render={({ field }) => (
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
                                rules={{ required: 'Style is required' }}
                                render={({ field }) => (
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
                                render={({ field }) => (
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
                                render={({ field }) => (
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
                            render={({ field }) => (
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
    );
}
