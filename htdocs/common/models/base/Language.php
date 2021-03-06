<?php
// This class was automatically generated by a giiant build task
// You should not change it manually as it will be overwritten on next build

namespace common\models\base;

use Yii;

/**
 * This is the base-model class for table "language".
 *
 * @property integer $id
 * @property string $name
 * @property integer $frequency
 * @property string $short_name
 * @property string $aliasModel
 */
abstract class Language extends \yii\db\ActiveRecord
{



    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'language';
    }


    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name', 'frequency', 'short_name'], 'required'],
            [['name', 'short_name'], 'string'],
            [['frequency'], 'integer']
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('models', 'ID'),
            'name' => Yii::t('models', 'Name'),
            'frequency' => Yii::t('models', 'Frequency'),
            'short_name' => Yii::t('models', 'Short Name'),
        ];
    }


    
    /**
     * @inheritdoc
     * @return \common\models\LanguageQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new \common\models\query\LanguageQuery(get_called_class());
    }


}
