import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import {Input } from "../ui/input";

function CommonForm({formControls,
     formData,setFormData, 
     onSubmit, buttonText,
     isButtonDisabled}){
    function renderInputsByComponentType(getControlItems){
        let element = null;
        const value = formData[getControlItems.name] || '';
        switch (getControlItems.componentType) {
            case 'input':
                element = (<Input 
                name={getControlItems.name} 
                placeholder ={getControlItems.placeHolder} 
                id = {getControlItems.name}
                type ={getControlItems.type}
                value ={value}
                onChange = {event=>setFormData({
                    ...formData,
                    [getControlItems.name]: event.target.value
                })}
                />)
                
                break;
            case 'select':
               element = (<Select onValueChange={(value)=>setFormData({
                ...formData,
                [getControlItems.name]: value
               })} value={value}>
                    <SelectTrigger className ="w-full"> 
                        <SelectValue placeholder={getControlItems.placeHolder} />
                    </SelectTrigger>
                    <SelectContent>
                        {getControlItems.options && getControlItems.options.length > 0 ?
                         getControlItems.options.map((optionItem)=>(<SelectItem key={optionItem.id} value={optionItem.id}>{optionItem.label}</SelectItem> )) : null
                        }
                    </SelectContent>
                </Select>)
                
                break;
            case 'textarea':
                element = (<Textarea value={value} 
                name={getControlItems.name} 
                placeholder={getControlItems.placeHolder} 
                id = {getControlItems.name}
                type ={getControlItems.type}
                onChange = {event=>setFormData({
                    ...formData,
                    [getControlItems.name]: event.target.value
                })}
                />)
                
                break;
        
            default:
                element = (<Input name={getControlItems.name} 
                placeholder={getControlItems.placeHolder} 
                id = {getControlItems.name}
                type ={getControlItems.type}
                value ={value}
                onChange = {event=>setFormData({
                    ...formData,
                    [getControlItems.name]: event.target.value
                })}
                />)
                
                break;
        }
        return element;
    }
    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-3">
                {formControls.map(controlItem=> (<div className="grid w-full gap-1.5" key={controlItem.name}>
                    <Label className="mb-1">{controlItem.label}</Label>
                    {
                        renderInputsByComponentType(controlItem)
                    }
                </div>
                    ))}
            </div>
            <Button disabled={isButtonDisabled} type="submit" className="mt-2 w-full">{buttonText || 'Submit'}</Button>
        </form>
    );
}

export default CommonForm;