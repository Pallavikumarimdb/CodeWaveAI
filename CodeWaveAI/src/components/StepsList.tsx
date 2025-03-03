import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Step } from '../types';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {
  return (
    <div className=" rounded-lg border border-slate-800 shadow-lg p-2 h-full overflow-auto">
      <h2 className="text-md font-semibold mb-2 text-gray-100">Build Steps</h2>
      <div className="space-y-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`p-1 rounded-lg cursor-pointer transition-colors ${
              currentStep === step.id
                ? 'bg-gray-800 border border-gray-700'
                : 'hover:bg-gray-800'
            }`}
            onClick={() => onStepClick(step.id)}
          >
            <div className="flex items-center gap-1">
              {step.status === 'completed' ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : step.status === 'in-progress' ? (
                <Clock className="w-4 h-4 text-blue-400" />
              ) : (
                <Circle className="w-4 h-4 text-gray-600" />
              )}
              <p className="text-xs font-extralight text-gray-100">{step.title}</p>
            </div>
            <p className="font-extralight text-xs text-gray-400 ">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}