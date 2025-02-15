import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { LoadingButton } from '@mui/lab';
import { Course } from '../../types/Course.type';
import { FormatType, getVNDateString, secondsToTimeString } from '../../utils/TimeFormater';
import { FavoriteButton } from '..';

interface Props {
    course: Course | undefined;
}

const CourseCardHover = ({ course }: Props) => {
    const handleBuyClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
    };

    return (
        <>
            <div className="flex max-w-[300px] flex-col gap-1 p-4 pb-6">
                <h1 className="text-lg font-bold">{course?.title}</h1>
                <p className="mt-1 text-xs text-green-600">
                    Cập nhật mới nhất{' '}
                    <span className="font-bold">{getVNDateString(course?.updateAt)}</span>
                </p>
                <p className="text-xs">
                    Thời lượng{' '}
                    {secondsToTimeString(course?.totalDuration, FormatType.HH_MM, [
                        ' Giờ',
                        ' phút',
                    ])}
                </p>
                <p className="mt-1 line-clamp-2 text-ellipsis">{course?.description}</p>
                <div className="flex flex-col gap-1 text-sm">
                    {course?.knowdledgeDescription &&
                        course?.knowdledgeDescription.split('|').map((string, index) => (
                            <div className="flex gap-4" key={index}>
                                <span>
                                    <CheckOutlinedIcon style={{ fontSize: 'inherit' }} />
                                </span>
                                <span className="line-clamp-2 text-ellipsis">{string}</span>
                            </div>
                        ))}
                </div>
                <div className="mt-4 flex gap-2">
                    <LoadingButton fullWidth onClick={handleBuyClick} variant="contained">
                        Mua khóa học
                    </LoadingButton>
                    {course?.courseId && <FavoriteButton courseId={course?.courseId} />}
                </div>
            </div>
        </>
    );
};

export default CourseCardHover;
