import React, { useState, useRef, useEffect } from "react";
import {TextField, Button, Typography, Box, Autocomplete} from "@mui/material";
import styled from "styled-components";
import BackButton from "../components/BackButtons.tsx";

interface Cocktail {
    id: string | null;
    name: string;
    ingredients: { ingredient: string; measure: string }[];
    instructions: string;
    image: string | null;
    category: string | null;
    tags: string[];
    dateModified: string | null;
}

const initialCocktailState = {
    id: null,
    name: "",
    ingredients: [],
    instructions: "",
    category:"",
    image: "",
    tags: [],
    dateModified: null,
};

const AddCocktail: React.FC = () => {

    const inputRefs = useRef<{ [key: string]: HTMLDivElement | HTMLInputElement |  HTMLTextAreaElement | null }>({});
    const [cocktail, setCocktail] = useState<Cocktail>(initialCocktailState);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [currentIngredient, setCurrentIngredient] = useState<string>("");
    const [currentCategoryTags, setCurrentCategoryTags] = useState("");
    const [currentMeasure, setCurrentMeasure] = useState<string>("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [invalidFields, setInvalidFields] = useState<string[]>([]);


    useEffect(() => {
        // Clear the border when the field is filled
        Object.keys(inputRefs.current).forEach((key) => {
            const fieldRef = inputRefs.current[key];
            if (fieldRef) {
                fieldRef.style.border = invalidFields.includes(key) ? "3px solid red" : "";
            }
        });
    }, [invalidFields]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCocktail(prev => ({ ...prev, [name]: value }));
    };

    const addIngredient = () => {
        if (currentIngredient?.trim() && currentMeasure?.trim()) {
            const newIngredient = { ingredient: currentIngredient.trim(), measure: currentMeasure.trim() };

            setCocktail(prev => ({
                ...prev,
                ingredients: editingIndex !== null
                    ? prev.ingredients.map((item, index) => index === editingIndex ? newIngredient : item)
                    : [...prev.ingredients, newIngredient],
            }));

            resetIngredientFields();
        }
    };

    const resetIngredientFields = () => {
        setCurrentIngredient(""); // Reset ingredient input
        setCurrentMeasure(""); // Reset measure input
        setEditingIndex(null); // Reset editing index
    };

    const handleEdit = (index: number) => {
        const ingredientToEdit = cocktail.ingredients[index];
        setCurrentIngredient(ingredientToEdit.ingredient);
        setCurrentMeasure(ingredientToEdit.measure);
        setEditingIndex(index);
    };




    const addCategoryTag = (tag: string) => {
        if (tag?.trim() && !cocktail.tags.includes(tag?.trim())) {
            setCocktail(prev => ({ ...prev, tags: [...prev.tags, tag?.trim()] }));
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addCategoryTag(currentCategoryTags);
        }
    };

    const handleDelete = (index: number) => {
        setCocktail(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index),
        }));
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
            setCocktail(prev => ({ ...prev, image: file.name }));
        }
    };

    const handleSubmit = () => {
        setError("");
        setSuccess("");


        const isFormValid = handleValidation();
        if (!isFormValid) {
            setError("All fields are required.");
            return;
        }

        resetFieldBorders();
        const parsedCategories = cocktail?.tags.join(", ").replace(/^,|,$/g, '');

        const newCocktail: Record<string, string> = {
            idDrink: Date.now().toString(),
            strDrink: cocktail.name,
            strInstructions: cocktail.instructions,
            strDrinkThumb: imagePreview || '',
            strCategory: cocktail.category || '',
            strTags: parsedCategories,
            dateModified: new Date().toISOString(),
        };

        cocktail?.ingredients.forEach((item, index) => {
            newCocktail[`strIngredient${index + 1}`] = item.ingredient;
            newCocktail[`strMeasure${index + 1}`] = item.measure;
        });

        const savedCocktails = JSON.parse(localStorage.getItem("my-cocktails") || "[]");
        savedCocktails.push(newCocktail);
        localStorage.setItem("my-cocktails", JSON.stringify(savedCocktails));

        setSuccess("Cocktail added successfully!");

        setTimeout(()=>{
            handleResetForm();
        }, 2000)

    };

    const handleValidation = ()=>{
        let isValid = true;
        const newInvalidFields: string[] = [];

        if (!cocktail.name.trim()) newInvalidFields.push("name");
        if (!cocktail.instructions.trim()) newInvalidFields.push("instructions");
        if (cocktail.ingredients.length === 0) newInvalidFields.push("ingredients");
        if (!imagePreview) newInvalidFields.push("image");

        if (newInvalidFields.length > 0) {
            isValid = false;
            setInvalidFields(newInvalidFields);

            const firstInvalidField = inputRefs.current[newInvalidFields[0]];
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }

        return isValid;

    }

    const handleResetForm = ()=>{
        setCocktail(initialCocktailState);
        setCurrentIngredient("");
        setCurrentMeasure("");
        setCurrentCategoryTags("");
        setImagePreview(null);
        setSuccess("")
    }

    const resetFieldBorders = () => {
        setInvalidFields([]); // Reset invalid fields
    };




    return (

        <>
            <BackButton/>
            <FormWrapper>
            <Title>Add New Cocktail</Title>

            <ImageContainer>
                <ImagePreviewContainer ref={(el) => {
                    if (el) {
                        inputRefs.current["image"] = el;
                    }
                }}>
                    {imagePreview ? (
                        <PreviewImage src={imagePreview} alt="Cocktail Preview" />
                    ) : (
                        <Placeholder>Image Preview</Placeholder>
                    )}
                </ImagePreviewContainer>
                <UploadFileContainer>
                    <SectionTitle>Upload Image</SectionTitle>
                    <input className={"input-file"} type="file" accept="image/*" onChange={handleImageUpload} />
                </UploadFileContainer>
            </ImageContainer>

            <FormFields>


            <StyledTextField
                label="Cocktail Name"
                value={cocktail.name}
                name="name"
                onChange={handleChange}
                fullWidth
                variant="filled"
                inputRef={(el)=> inputRefs.current["name"] = el}
            />

            <SectionTitle>Ingredients</SectionTitle>
            <IngredientContainer>
                <StyledTextField
                    className={"ingredient-text-input"}
                    label="Ingredient"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    fullWidth
                    variant="filled"
                    inputRef={(el)=> inputRefs.current["ingredient"] = el}

                />
                <StyledTextField
                    className={"ingredient-text-input"}
                    label="Measure"

                    value={currentMeasure}
                    onChange={(e) => setCurrentMeasure(e.target.value)}
                    fullWidth
                    variant="filled"
                    inputRef={(el)=> inputRefs.current["measure"] = el}
                />
                <AddIngredientButton variant="contained" onClick={addIngredient}>
                    {editingIndex !== null ? "Update Ingredient" : "Add Ingredient"}
                </AddIngredientButton>
            </IngredientContainer>

            <IngredientList>
                {cocktail.ingredients.length === 0 && invalidFields.includes("ingredients") && (
                    <span style={{ color: "red" }}>Please add at least one ingredient.</span>
                )}
                {cocktail.ingredients.map((item, index) => (
                    <IngredientItem key={index}>
                        <Typography>{item.ingredient} - {item.measure}</Typography>
                        <Box>
                            <EditButton variant="contained" onClick={() => handleEdit(index)}>Edit</EditButton>
                            <DeleteButton variant="contained" onClick={() => handleDelete(index)}>Delete</DeleteButton>
                        </Box>
                    </IngredientItem>
                ))}
            </IngredientList>

            <SectionTitle>Category</SectionTitle>
                <StyledTextField
                    label="Cocktail Category"
                    value={cocktail.category}
                    name="category"
                    onChange={handleChange}
                    fullWidth
                    variant="filled"
                    inputRef={(el)=> inputRefs.current["category"] = el}
                />
            <SectionTitle>Tags</SectionTitle>
            <Autocomplete
                freeSolo
                multiple
                id="tags"
                options={[]}
                inputValue={currentCategoryTags}
                onInputChange={(_, newInputValue) => {
                    setCurrentCategoryTags(newInputValue);
                }}
                renderInput={(params) => (
                    <StyledTextField
                        {...params}
                        label="Add Catoegories"
                        onKeyDown={handleKeyDown}
                        fullWidth
                        variant="filled"
                    />
                )}
            />

            <SectionTitle>Instructions</SectionTitle>
            <StyledTextField
                label="Instructions"
                value={cocktail.instructions}
                name="instructions"
                inputRef={(el)=> inputRefs.current["instructions"] = el}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                variant="filled"
            />

            </FormFields>

            <SubmitButton variant="contained" color="primary" onClick={handleSubmit}>
                Save Cocktail
            </SubmitButton>

                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}

            </FormWrapper>
</>
    );
};


const FormWrapper = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
`

const Title = styled(Typography).attrs({ variant: "h4" })`
    text-align: center;
    color: white;
    border-bottom: 2px solid;
    width: fit-content;
    align-items: center;
    margin: 0 auto 50px auto !important;
`;

const SectionTitle = styled(Typography).attrs({ variant: "h6" })`
    margin: 20px 0 !important;
    color: white;
`;

const StyledTextField = styled(TextField)`
    margin-bottom: 15px !important;
    background: white;
    border-radius: 5px;
    
    & .MuiInputLabel-root {
        color: #000; // Change label color to black
    }
    & .MuiInputLabel-root.Mui-focused {
        color: #000; 
        font-weight: bolder;
    }
    `;

const FormFields = styled.div`
    display: flex;
    margin: 0 auto;
    flex-direction: column;
    width: 100%
`


const IngredientContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px; 
    margin-bottom: 15px;

    .ingredient-text-input {
        flex: 1;
        text-align: center;
        border: 1px solid black;
        
    }
`;

const AddIngredientButton = styled(Button)`
    flex: .3;
    width: 80px;
    height: 56px;
    margin: inherit !important;
`;

const IngredientList = styled.div`
    margin-top: 15px;
`;


const IngredientItem = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    
`;

const EditButton = styled(Button)`
    background-color: #4caf50 !important; 
    color: white;
    margin: 0 10px !important;
    &:hover {
        background-color: #45a049 !important;
    }
`;

const DeleteButton = styled(Button)`
    background-color: #f44336 !important; 
    color: white;
    margin-left: 10px;
    &:hover {
        background-color: #e53935; 
    }
`;

const SubmitButton = styled(Button)`
    display: block;
    margin: 20px auto;
`;

const ImageContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    flex-wrap: nowrap;
    gap: 20px;
`;

const UploadFileContainer = styled.div`
    flex: 1;
`;

const ImagePreviewContainer = styled.div`
    width: 250px;
    min-height: 250px;
    height: auto;
    margin-bottom: 20px;
    border: 1px dashed #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9f9f9;
    border-radius: 5px;
`;

const PreviewImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
`;

const Placeholder = styled(Typography)`
    color: #aaa;
`;

const ErrorMessage = styled(Typography).attrs({ color: "error" })`
    text-align: center;
`;

const SuccessMessage = styled(Typography).attrs({ color: "success" })`
    text-align: center;
`;

export default AddCocktail;
