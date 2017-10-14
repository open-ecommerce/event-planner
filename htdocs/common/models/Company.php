<?php

namespace common\models;

use Yii;
use \common\models\base\Company as BaseCompany;
use yii\helpers\ArrayHelper;

/**
 * This is the model class for table "company".
 */
class Company extends BaseCompany {

    public function behaviors() {
        return ArrayHelper::merge(
                        parent::behaviors(), [
                        # custom behaviors
                        ]
        );
    }

    public function rules() {
        return ArrayHelper::merge(
                        parent::rules(), [
                    [['allowedCategories'], 'safe']
                        ]
        );
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAllowedCategories() {

        //$rows = BookCategoryTree::findAll(explode(',', $this->allowed_categories));
        $cats = explode(',', $this->allowed_categories);
        $rows = BookCategoryTree::find()->where(['id' => $cats])->orderBy('root')->all();

        $selectedCats = array();
        $selectedValues = array();

        static $lastParentId = 0;
        static $counter = 0;
        if (!empty($rows)) {
            $lastParentId = $rows[0]->root;
            foreach ($rows as $row) {
                if ($row->lvl === 0) {
                    $selectedCats[] = '<span class="parent-category">' . $row->name . '</span><br>';
                    $lastParentId = $row->root;
                } else {
                    $parent = $this->getParentName($row->root);
                    $selectedCats[] = '<span class="parent-category">' . $parent . "/" . $row->name . '</span><br>';
                    //$selectedCats[] = $parent . '* ';
//                    if ((count($selectedValues) >= 0) && ($lastParentId != $row->root)) {
//                        $selectedCats[] = '<span class="parent-category">' . $parent . '</span> (' . implode(', ', $selectedValues) . ')<br>';
//                        unset($selectedValues);
//                        $selectedValues = array();
//                    } else {
//                        $selectedValues[] = $row->name;
//                    }
//                    $lastParentId = $row->root;
                }
            }
        }
        return implode(' ', $selectedCats);
    }
    
    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAllowedCategoriesList() {

        //$rows = BookCategoryTree::findAll(explode(',', $this->allowed_categories));
        $selected = explode(',', $this->allowed_categories);
        $rows = BookCategoryTree::find()->where(['id' => $selected])->orderBy('root')->all();

        //$selectedCats = array();
        $selectedCats = '';
        if (!empty($rows)) {
            $lastRoot = 999;
            $parentName = '';
            foreach ($rows as $row) {
                if ($lastRoot != $row->root) {
                    $parent = BookCategoryTree::find()->where(['id' => $row->root])->one();
                    $parentName = $parent->name;
                    if (!empty($selectedCats)) {
                        $selectedCats .= '<br>';
                    }
                    $selectedCats .= '<strong>' . $parentName . ":</strong>" . $row->name;
                    $lastRoot = $row->root;
                } else {
                    $selectedCats .= '/ ' . $row->name;
                }
            }
        }
        return $selectedCats;        
        
        
        
    }    
    

    private function getParentName($parentId) {
        $parent = BookCategoryTree::findOne(['root' => $parentId]);
        return $parent->name;
    }
    
    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCountry() {
        return $this->hasOne(Country::className(), ['id' => 'country_id']);
    }

}
