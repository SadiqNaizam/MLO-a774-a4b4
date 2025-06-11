import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OptionChoice {
  id: string;
  label: string;
  priceAdjustment?: number; // e.g., +1.00 for extra cheese
}

interface CustomizationOption {
  id: string;
  title: string; // e.g., "Choose Size", "Select Toppings"
  type: 'radio' | 'checkbox' | 'quantity' | 'textarea'; // Type of selection
  choices?: OptionChoice[]; // For radio/checkbox
  maxSelections?: number; // For checkbox groups
  required?: boolean;
  defaultValue?: string | string[];
}

interface CustomizationModalContentProps {
  itemName: string;
  basePrice: number;
  options: CustomizationOption[];
  onSubmit: (customizations: Record<string, any>, finalPrice: number) => void; // Passes selected options and final price
  submitButtonText?: string;
}

const CustomizationModalContent: React.FC<CustomizationModalContentProps> = ({
  itemName,
  basePrice,
  options,
  onSubmit,
  submitButtonText = "Add to Cart",
}) => {
  console.log("Rendering CustomizationModalContent for:", itemName);
  // Initialize state based on options
  const initialSelections: Record<string, any> = {};
  options.forEach(opt => {
    if (opt.type === 'quantity') {
      initialSelections[opt.id] = 1; // Default quantity
    } else if (opt.type === 'textarea') {
      initialSelections[opt.id] = '';
    } else if (opt.defaultValue) {
      initialSelections[opt.id] = opt.defaultValue;
    } else if (opt.type === 'checkbox') {
      initialSelections[opt.id] = [];
    }
  });
  const [selections, setSelections] = useState<Record<string, any>>(initialSelections);
  const [currentPrice, setCurrentPrice] = useState(basePrice);

  const handleSelectionChange = (optionId: string, value: any, priceAdjustment: number = 0) => {
    setSelections(prev => ({ ...prev, [optionId]: value }));
    // Basic price calculation - can be made more robust
    // This example just adds price adjustments to the base price. Recalculate total based on all selections.
    // For simplicity, this example doesn't fully recalculate if a radio option changes.
    // A more robust solution would iterate all selections on each change.
    setCurrentPrice(prevPrice => prevPrice + priceAdjustment); // Simplified
  };

  const calculateFinalPrice = () => {
    let finalPrice = basePrice;
    if (selections['quantity']) {
        finalPrice *= selections['quantity'];
    }
    options.forEach(opt => {
        if (opt.choices && (opt.type === 'radio' || opt.type === 'checkbox')) {
            const selectedValue = selections[opt.id];
            if (opt.type === 'radio' && selectedValue) {
                const choice = opt.choices.find(c => c.id === selectedValue);
                if (choice && choice.priceAdjustment) finalPrice += choice.priceAdjustment;
            } else if (opt.type === 'checkbox' && Array.isArray(selectedValue)) {
                selectedValue.forEach(selId => {
                    const choice = opt.choices?.find(c => c.id === selId);
                    if (choice && choice.priceAdjustment) finalPrice += choice.priceAdjustment;
                });
            }
        }
    });
    return finalPrice;
  };


  const handleSubmit = () => {
    const finalPrice = calculateFinalPrice();
    console.log("Submitting customizations:", selections, "Final Price:", finalPrice);
    onSubmit(selections, finalPrice);
  };
  
  return (
    <div className="p-1 sm:p-2"> {/* Reduced padding for modal */}
      <h3 className="text-lg font-semibold mb-4">{`Customize ${itemName}`}</h3>
      <ScrollArea className="max-h-[60vh] pr-3 mb-4"> {/* Max height for scrollability */}
        <div className="space-y-6">
          {options.map((option) => (
            <div key={option.id}>
              <Label htmlFor={option.id} className="text-md font-medium">
                {option.title}
                {option.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {option.type === 'radio' && option.choices && (
                <RadioGroup
                  id={option.id}
                  defaultValue={option.defaultValue as string}
                  onValueChange={(value) => {
                    const choice = option.choices?.find(c => c.id === value);
                    handleSelectionChange(option.id, value, choice?.priceAdjustment);
                  }}
                  className="mt-2 space-y-1"
                >
                  {option.choices.map((choice) => (
                    <div key={choice.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={choice.id} id={`${option.id}-${choice.id}`} />
                      <Label htmlFor={`${option.id}-${choice.id}`} className="font-normal">
                        {choice.label}
                        {choice.priceAdjustment ? ` (${choice.priceAdjustment > 0 ? '+' : ''}${choice.priceAdjustment.toFixed(2)})` : ''}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {option.type === 'checkbox' && option.choices && (
                <div className="mt-2 space-y-1">
                  {option.choices.map((choice) => (
                    <div key={choice.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${option.id}-${choice.id}`}
                        onCheckedChange={(checked) => {
                          const currentSelection = selections[option.id] || [];
                          const newSelection = checked
                            ? [...currentSelection, choice.id]
                            : currentSelection.filter((id: string) => id !== choice.id);
                          handleSelectionChange(option.id, newSelection, checked ? choice.priceAdjustment : -(choice.priceAdjustment || 0));
                        }}
                        checked={(selections[option.id] || []).includes(choice.id)}
                      />
                      <Label htmlFor={`${option.id}-${choice.id}`} className="font-normal">
                        {choice.label}
                        {choice.priceAdjustment ? ` (${choice.priceAdjustment > 0 ? '+' : ''}${choice.priceAdjustment.toFixed(2)})` : ''}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              {option.type === 'quantity' && (
                 <Input
                    id={option.id}
                    type="number"
                    min="1"
                    defaultValue={option.defaultValue as string || "1"}
                    onChange={(e) => handleSelectionChange(option.id, parseInt(e.target.value) || 1)}
                    className="mt-2 w-20"
                 />
              )}
              {option.type === 'textarea' && (
                 <Textarea
                    id={option.id}
                    placeholder="Any special requests?"
                    defaultValue={option.defaultValue as string || ""}
                    onChange={(e) => handleSelectionChange(option.id, e.target.value)}
                    className="mt-2 min-h-[60px]"
                 />
              )}
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <div className="text-lg font-semibold">
          Total: ${calculateFinalPrice().toFixed(2)}
        </div>
        <Button onClick={handleSubmit} size="lg">
          {submitButtonText}
        </Button>
      </div>
    </div>
  );
};

export default CustomizationModalContent;