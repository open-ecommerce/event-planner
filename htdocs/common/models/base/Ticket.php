<?php
// This class was automatically generated by a giiant build task
// You should not change it manually as it will be overwritten on next build

namespace common\models\base;
use trntv\filekit\behaviors\UploadBehavior;

use Yii;

/**
 * This is the base-model class for table "ticket".
 *
 * @property integer $id
 * @property integer $barcode
 * @property integer $transaction_id
 * @property integer $attendee_id
 * @property integer $registration_id
 * @property integer $order_id
 * @property string $registration_time
 * @property string $registration_code
 * @property string $registration_status
 * @property string $transaction_status
 * @property double $transaction_amount
 * @property double $amount_paid
 * @property string $payment_date
 * @property string $payment_method
 * @property string $geteway_transaction
 * @property string $ticket_name
 * @property string $ticket_date
 * @property string $first_name
 * @property string $last_name
 * @property string $email
 * @property string $address_1
 * @property string $address_2
 * @property string $city
 * @property string $state
 * @property string $country
 * @property string $nationality
 * @property string $postal_code
 * @property string $phone
 * @property string $notes
 * @property string $nationality_partner
 * @property string $aliasModel
 * @property string $ticket_status
 * @property string $first_name_partner
 * @property string $reg_city
 * @property string $reg_country
 * @property string $reg_fb
 * @property string $reg_phone
 * @property string $reg_whats_up
 * @property string $reg_email
 * @property string $role
 * @property string $couple_registration
 * @property string $reg_city_partner
 * @property string $reg_country_partner
 * @property string $reg_fb_partner
 * @property string $reg_phone_partner
 * @property string $reg_email_partner
 * @property string $reg_notes
 */
abstract class Ticket extends \yii\db\ActiveRecord
{


    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'ticket';
    }

    public $thumbnail;        
    public $barcodeSearch;        
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            [
                'class' => UploadBehavior::className(),
                'attribute' => 'thumbnail',
                'pathAttribute' => 'thumbnail_path',
                'baseUrlAttribute' => 'thumbnail_base_url'
            ]
        ];
    }    
    
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'transaction_id', 'attendee_id', 'registration_id', 'order_id', 'ticket_type_id', 'couple_registration'], 'integer'],
            [['thumbnail','registration_time', 'payment_date', 'ticket_date','ticket_status'], 'safe'],
            [['transaction_amount', 'amount_paid'], 'number'],
            [['notes'], 'string'],
            [['first_name_partner', 'last_name_partner', 'nationality_partner', 'reg_city', 'reg_country', 'reg_fb', 'reg_phone', 'nationality', 'reg_whats_up', 'reg_email', 'reg_role'], 'safe'],
            [['reg_city_partner', 'reg_country_partner', 'reg_fb_partner', 'reg_phone_partner', 'reg_email_partner'], 'safe'],
            [['first_name', 'last_name', 'ticket_type_id'], 'required'],
            [['registration_code', 'registration_status', 'transaction_status', 'payment_method', 'geteway_transaction', 'address_1', 'address_2', 'city', 'state', 'country', 'postal_code', 'phone'], 'string', 'max' => 100],
            [['first_name_partner', 'last_name_partner', 'nationality_partner', 'reg_city', 'reg_country', 'reg_fb', 'reg_phone', 'reg_whats_up', 'reg_email', 'reg_role'], 'string', 'max' => 100],
            [['reg_city_partner', 'reg_country_partner', 'reg_fb_partner', 'reg_phone_partner', 'reg_email_partner'], 'string', 'max' => 100],
            [['barcodeSearch','barcode', 'ticket_name', 'first_name', 'last_name', 'email'], 'string', 'max' => 100]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('models', 'ID'),
            'barcode' => Yii::t('models', 'Barcode'),
            'transaction_id' => Yii::t('models', 'Transaction ID'),
            'attendee_id' => Yii::t('models', 'Attendee ID'),
            'registration_id' => Yii::t('models', 'Registration ID'),
            'order_id' => Yii::t('models', 'Order ID'),
            'registration_time' => Yii::t('models', 'Registration Time'),
            'registration_code' => Yii::t('models', 'Registration Code'),
            'registration_status' => Yii::t('models', 'Registration Status'),
            'transaction_status' => Yii::t('models', 'Transaction Status'),
            'transaction_amount' => Yii::t('models', 'Transaction Amount'),
            'amount_paid' => Yii::t('models', 'Amount Paid'),
            'payment_date' => Yii::t('models', 'Payment Date'),
            'payment_method' => Yii::t('models', 'Payment Method'),
            'geteway_transaction' => Yii::t('models', 'Geteway Transaction'),
            'ticket_type_id' => Yii::t('models', 'Ticket Type'),
            'ticket_name' => Yii::t('models', 'WP Ticket Name'),
            'ticket_status' => Yii::t('models', 'Ticket Status'),
            'ticket_date' => Yii::t('models', 'Ticket Date'),
            'first_name' => Yii::t('models', 'First Name'),
            'last_name' => Yii::t('models', 'Last Name'),
            'email' => Yii::t('models', 'Email'),
            'address_1' => Yii::t('models', 'Address 1'),
            'address_2' => Yii::t('models', 'Address 2'),
            'city' => Yii::t('models', 'City'),
            'state' => Yii::t('models', 'State'),
            'country' => Yii::t('models', 'Country'),
            'nationality' => Yii::t('models', 'Nationality'),
            'postal_code' => Yii::t('models', 'Postal Code'),
            'phone' => Yii::t('models', 'Phone'),
            'notes' => Yii::t('models', 'Notes'),
            'first_name_partner' => Yii::t('models', 'Partner First Name'),
            'nationality_partner' => Yii::t('models', 'Dance Partner Nationality'),
            'reg_city' => Yii::t('models', 'City'),
            'reg_Country' => Yii::t('models', 'Country'),
            'reg_Phone' => Yii::t('models', 'Phone'),
            'reg_whats_up' => Yii::t('models', 'WhatsUp?'),
            'reg_fb' => Yii::t('models', 'Facebook'),
            'reg_email' => Yii::t('models', 'Email'),
            'reg_role' => Yii::t('models', 'Role'),
        ];
    }


    
    /**
     * @inheritdoc
     * @return \common\models\query\Ticket the active query used by this AR class.
     */
    public static function find()
    {
        return new \common\models\query\TicketQuery(get_called_class());
    }


}
