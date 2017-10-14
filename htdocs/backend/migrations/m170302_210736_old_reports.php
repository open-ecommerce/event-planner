<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210736_old_reports extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%old_reports}}',
            [
                'author'=> $this->string(300)->null()->defaultValue(null),
                'title'=> $this->string(300)->null()->defaultValue(null),
                'copyright_owner'=> $this->string(300)->null()->defaultValue(null),
                'publisher'=> $this->string(300)->null()->defaultValue(null),
                'requested_date'=> $this->date()->null()->defaultValue(null),
                'recived_date'=> $this->date()->null()->defaultValue(null),
                'material_state'=> $this->string(300)->null()->defaultValue(null),
                'category'=> $this->string(300)->null()->defaultValue(null),
                'veredict'=> $this->string(300)->null()->defaultValue(null),
                'notes'=> $this->string(300)->null()->defaultValue(null),
                'report'=> $this->text()->null()->defaultValue(null),
                'report_sent_to'=> $this->string(50)->null()->defaultValue(null),
                'report_sent_date'=> $this->date()->null()->defaultValue(null),
                'item_number'=> $this->integer(11)->null()->defaultValue(null),
                'entered_date'=> $this->date()->null()->defaultValue(null),
                'used_in_report'=> $this->string(300)->null()->defaultValue(null),
                'descision'=> $this->string(300)->null()->defaultValue(null),
                'cat_number'=> $this->string(300)->null()->defaultValue(null),
                'pages_manuscripts'=> $this->string(300)->null()->defaultValue(null),
                'pages_book'=> $this->string(300)->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%old_reports}}');
    }
}
