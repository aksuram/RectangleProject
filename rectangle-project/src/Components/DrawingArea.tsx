import { MouseEvent, useEffect, useState } from "react";
import { Rectangle } from "../Interfaces/Rectangle";
import { Position } from "../Interfaces/Position";
import { API_URL } from "../config";
import { ErrorMessage } from "../Interfaces/ErrorMessage";

const DrawingArea = () => {
    const [rectSize, setRectSize] = useState<Rectangle>({width: 10, height: 10});
    const [isInResizeMode, setIsInResizeMode] = useState<boolean>(false);
    const [initialMousePosition, setInitialMousePosition] = useState<Position>({x: 0, y: 0});
    const [initialRectSize, setInitialRectSize] = useState<Rectangle>({width: 0, height: 0});
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const viewBoxSize: Rectangle = {width: 100, height: 100};
    const minRectSize: Rectangle = {width: 2, height: 2};
    //SVG ViewBox size is fixed at 100x100 while the maximum display/browser coordinate drawing area size is fixed at 800x800 pixels. The added division by 2 is there because the rectangle is centered at the drawing area.
    const viewBoxAndBrowserCoordinateScaleDifference = 8 / 2;

    useEffect(() => {
        downloadRectangle();
    },[]);

    const handleMouseDownEvent = (e: MouseEvent<SVGCircleElement, globalThis.MouseEvent>) => {
        setIsInResizeMode(true);
        setInitialRectSize({width: rectSize.width, height: rectSize.height})
        setInitialMousePosition({x: e.clientX, y: e.clientY});
    };

    const handleMouseUpEvent = (e: MouseEvent<SVGSVGElement, globalThis.MouseEvent>) => {
        setIsInResizeMode(false);
        if (isUploading === true) return;

        uploadRectangle(rectSize);
    };

    const handleMouseMoveEvent = (e: MouseEvent<SVGSVGElement, globalThis.MouseEvent>) => {
        if (isInResizeMode) {
            setRectSize({width: Math.max(Math.round(initialRectSize.width + (e.clientX - initialMousePosition.x) / viewBoxAndBrowserCoordinateScaleDifference), minRectSize.width),
                height: Math.max(Math.round(initialRectSize.height + (e.clientY - initialMousePosition.y) / viewBoxAndBrowserCoordinateScaleDifference), minRectSize.height)});
        }
    };

    const downloadRectangle = async () => {
        try {
            const response = await fetch(`${API_URL}rectangle`);

            if (response.status === 404) {
                await response
                    .json()
                    .then((errorMessage: ErrorMessage) =>
                        setErrorMessage(errorMessage.errorMessage)
                    );
                return;
            }
        
            if (response.status === 200) {
                await response
                    .json()
                    .then(setRectSize);
                return;
            }

            setErrorMessage('Unknown error');
        } catch (error) {
            setErrorMessage('Unknown error');
        }
    };

    const uploadRectangle = async (rect: Rectangle) => {
        setIsUploading(true);
        try {
            const response = await fetch(`${API_URL}rectangle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rect),
            });

            if (response.status === 200){
                setErrorMessage('Validated and uploaded the rectangle');
                setIsUploading(false);
                return;
            }
        
            if (response.status === 400) {
                const { errorMessage } = (await response.json()) as ErrorMessage;
                setErrorMessage(errorMessage);
                setIsUploading(false);
                return;
            }

        } catch (error) {
            setErrorMessage('Unable to verify rectangle on the backend');
        }
        setIsUploading(false);
    };

    return (
        <>
            <div style={{display:'flex', width: '800px', height: '800px', border: 'solid'}}>
                <svg viewBox="0 0 100 100" width='100%' height='100%' onMouseUp={handleMouseUpEvent} onMouseMove={handleMouseMoveEvent}>
                    <rect x={viewBoxSize.width / 2 - rectSize.width / 2} y={viewBoxSize.height / 2 - rectSize.height / 2} width={rectSize.width} height={rectSize.height} />
                    <circle cx={viewBoxSize.width / 2 + rectSize.width / 2  - 0.5} cy={viewBoxSize.height / 2 + rectSize.height / 2 - 0.5} r='0.8' fill="red" style={{cursor: 'se-resize'}} onMouseDown={handleMouseDownEvent} />
                    <text x={viewBoxSize.width / 2} y={viewBoxSize.height / 2 + rectSize.height / 2 + 2} fontSize='3' textAnchor='middle' dominantBaseline='central' style={{userSelect: 'none'}}>
                            Perimeter: {(2 * (rectSize.width + rectSize.height)).toFixed(0)}</text>
                    <text x={viewBoxSize.width / 2} y={viewBoxSize.height / 2 - rectSize.height / 2 - 2} fontSize='2.5' textAnchor='middle' dominantBaseline='central' style={{userSelect: 'none'}}>
                            Width: {rectSize.width.toFixed(0)}</text>
                    <text x={viewBoxSize.width / 2 - rectSize.width / 2 - 2} y={viewBoxSize.height / 2} fontSize='2.5' textAnchor='middle' dominantBaseline='central' style={{userSelect: 'none'}}
                        transform={`rotate(270, ${viewBoxSize.width / 2 - rectSize.width / 2 - 2}, ${viewBoxSize.height / 2})`}>
                            Height: {rectSize.height.toFixed(0)}</text>
                </svg>
            </div>
            <div style={{display: 'flex', minHeight: '50px'}} ><b>{errorMessage}</b></div>
        </>
    );
};

export default DrawingArea;
